import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
    name: string;
    diabetesType: 'Type 1' | 'Type 2';
    targetGlucoseMin: number;  // mg/dL
    targetGlucoseMax: number;  // mg/dL
    isProfileComplete: boolean;
}

interface UserState {
    profile: UserProfile | null;
    isLoggedIn: boolean;

    // Actions
    setProfile: (profile: UserProfile) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    login: () => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            isLoggedIn: false,

            setProfile: (profile) => set({ profile, isLoggedIn: true }),

            updateProfile: (updates) => set((state) => ({
                profile: state.profile ? { ...state.profile, ...updates } : null,
            })),

            login: () => set({ isLoggedIn: true }),

            logout: () => set({ profile: null, isLoggedIn: false }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
