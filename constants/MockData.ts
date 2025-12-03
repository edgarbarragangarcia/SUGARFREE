export type GlucoseTag = 'Ayunas' | 'Antes de Comer' | 'Después de Comer' | 'Al Dormir';

export interface GlucoseReading {
    id: string;
    value: number;          // mg/dL
    timestamp: number;      // Unix timestamp
    tag: GlucoseTag;
    note?: string;
}

// Datos de ejemplo para visualización inicial (últimos 7 días)
export const MockGlucoseData: GlucoseReading[] = [
    {
        id: '1',
        value: 95,
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        tag: 'Ayunas',
    },
    {
        id: '2',
        value: 118,
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        tag: 'Después de Comer',
    },
    {
        id: '3',
        value: 102,
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        tag: 'Antes de Comer',
    },
    {
        id: '4',
        value: 135,
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        tag: 'Después de Comer',
    },
    {
        id: '5',
        value: 88,
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        tag: 'Ayunas',
    },
    {
        id: '6',
        value: 110,
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        tag: 'Al Dormir',
    },
    {
        id: '7',
        value: 105,
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        tag: 'Ayunas',
    },
];
