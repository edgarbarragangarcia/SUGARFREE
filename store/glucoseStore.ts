import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GlucoseReading } from '../constants/MockData';

interface GlucoseState {
    readings: GlucoseReading[];

    // Actions
    addReading: (reading: Omit<GlucoseReading, 'id'>) => void;
    removeReading: (id: string) => void;
    updateReading: (id: string, updates: Partial<GlucoseReading>) => void;
    getLatestReading: () => GlucoseReading | null;
    getReadingsInRange: (startTime: number, endTime: number) => GlucoseReading[];
    clearAllReadings: () => void;
}

export const useGlucoseStore = create<GlucoseState>()(
    persist(
        (set, get) => ({
            readings: [],

            addReading: (reading) => set((state) => ({
                readings: [
                    ...state.readings,
                    {
                        ...reading,
                        id: Date.now().toString() + Math.random().toString(36).substring(7),
                    },
                ].sort((a, b) => b.timestamp - a.timestamp), // Sort newest first
            })),

            removeReading: (id) => set((state) => ({
                readings: state.readings.filter((r) => r.id !== id),
            })),

            updateReading: (id, updates) => set((state) => ({
                readings: state.readings.map((r) =>
                    r.id === id ? { ...r, ...updates } : r
                ),
            })),

            getLatestReading: () => {
                const { readings } = get();
                return readings.length > 0 ? readings[0] : null;
            },

            getReadingsInRange: (startTime, endTime) => {
                const { readings } = get();
                return readings.filter(
                    (r) => r.timestamp >= startTime && r.timestamp <= endTime
                );
            },

            clearAllReadings: () => set({ readings: [] }),
        }),
        {
            name: 'glucose-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
