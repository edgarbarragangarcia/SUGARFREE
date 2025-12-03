// Premium Color System with Gradients and Glassmorphism
export const Colors = {
    // Primary Colors - Vibrant Teal with HSL tuning
    primary: '#14B8A6',           // Brighter teal
    primaryDark: '#0D9488',       // Darker teal
    primaryLight: '#5EEAD4',      // Light teal

    // Secondary Colors - Vibrant Red/Pink
    secondary: '#F43F5E',         // Rose red
    secondaryDark: '#E11D48',     // Deep rose
    secondaryLight: '#FB7185',    // Light rose

    // Success Colors - Vibrant Green
    success: '#22C55E',           // Bright green
    successDark: '#16A34A',       // Dark green
    successLight: '#86EFAC',      // Light green

    // Warning Colors - Vibrant Orange/Amber
    warning: '#F59E0B',           // Amber
    warningDark: '#D97706',       // Dark amber
    warningLight: '#FCD34D',      // Light amber

    // Danger Colors - Vibrant Red
    danger: '#EF4444',            // Red
    dangerDark: '#DC2626',        // Dark red
    dangerLight: '#FCA5A5',       // Light red

    // Glucose Level Colors - More vibrant
    glucoseNormal: '#22C55E',     // Bright green (70-140 mg/dL)
    glucoseMedium: '#F59E0B',     // Amber (141-180 mg/dL)
    glucoseHigh: '#F43F5E',       // Rose red (>180 mg/dL)
    glucoseLow: '#EF4444',        // Red (<70 mg/dL)

    // Background Colors
    background: '#0F172A',        // Dark slate background
    backgroundLight: '#1E293B',   // Lighter dark slate
    backgroundCard: '#1E293B',    // Card background

    // Glassmorphism Colors
    glassBackground: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassBackgroundDark: 'rgba(30, 41, 59, 0.7)',

    // Text Colors
    text: '#F1F5F9',              // Light slate text
    textLight: '#94A3B8',         // Muted slate
    textDark: '#1F2937',          // Dark text for light backgrounds

    // UI Colors
    border: '#334155',            // Slate border
    white: '#FFFFFF',
    black: '#000000',

    // Overlay Colors
    overlay: 'rgba(15, 23, 42, 0.8)',
    overlayLight: 'rgba(15, 23, 42, 0.6)',

    // Shadow Colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(0, 0, 0, 0.1)',
};

// Gradient Definitions for Premium Effects
export const Gradients = {
    primary: ['#14B8A6', '#06B6D4'] as const,           // Teal to Cyan
    secondary: ['#F43F5E', '#EC4899'] as const,         // Rose to Pink
    success: ['#22C55E', '#10B981'] as const,           // Green to Emerald
    warning: ['#F59E0B', '#F97316'] as const,           // Amber to Orange
    danger: ['#EF4444', '#DC2626'] as const,            // Red to Dark Red

    // Special Gradients
    glucose: {
        normal: ['#22C55E', '#10B981'] as const,        // Green gradient
        medium: ['#F59E0B', '#F97316'] as const,        // Orange gradient
        high: ['#F43F5E', '#EC4899'] as const,          // Pink gradient
        low: ['#EF4444', '#DC2626'] as const,           // Red gradient
    },

    // Background Gradients
    background: ['#0F172A', '#1E293B'] as const,        // Dark slate gradient
    card: ['#1E293B', '#334155'] as const,              // Card gradient

    // Premium Effects
    shimmer: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0)'] as const,
    glow: ['rgba(20, 184, 166, 0.5)', 'rgba(20, 184, 166, 0)'] as const,
};

export const GlucoseRanges = {
    LOW: 70,           // Below this is hypoglycemia
    TARGET_MIN: 70,    // Normal range minimum
    TARGET_MAX: 140,   // Normal range maximum
    MEDIUM_MAX: 180,   // Above this is high risk
};
