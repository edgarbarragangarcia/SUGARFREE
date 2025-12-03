export type GlucoseTag = 'Ayunas' | 'Antes de Comer' | 'Después de Comer' | 'Al Dormir';

export interface GlucoseReading {
    id: string;
    value: number;          // mg/dL
    timestamp: number;      // Unix timestamp
    tag: GlucoseTag;
    note?: string;
}

export const MockGlucoseData: GlucoseReading[] = [
    {
        id: '1',
        value: 95,
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        tag: 'Antes de Comer',
        note: 'Sentirse bien',
    },
    {
        id: '2',
        value: 145,
        timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
        tag: 'Después de Comer',
        note: 'Comida pesada',
    },
    {
        id: '3',
        value: 88,
        timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
        tag: 'Ayunas',
    },
    {
        id: '4',
        value: 110,
    {
        id: '7',
        value: 105,
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        tag: 'Fasting',
    },
];
