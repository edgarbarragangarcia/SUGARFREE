// Premium Color System with Gradients and Glassmorphism
export const Colors = {
    // Primary Colors - Premium Black/Dark Grey
    primary: '#0F172A',           // Slate 900 (Deep dark blue/black)
    primaryDark: '#020617',       // Slate 950 (Almost black)
    primaryLight: '#334155',      // Slate 700 (Lighter grey for hover/active)

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
    background: '#F8FAFC',        // Slate 50 (Light background)
    backgroundLight: '#FFFFFF',   // Pure white
    backgroundCard: '#FFFFFF',    // White cards

    // Glassmorphism Colors
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    glassBackgroundDark: 'rgba(15, 23, 42, 0.05)',

    // Text Colors
    text: '#0F172A',              // Slate 900 (Dark text)
    textLight: '#64748B',         // Slate 500 (Muted text)
    textDark: '#FFFFFF',          // White text for dark backgrounds (buttons)

    // UI Colors
    border: '#E2E8F0',            // Slate 200 (Light border)
    white: '#FFFFFF',
    black: '#000000',

    // Overlay Colors
    overlay: 'rgba(255, 255, 255, 0.9)',
    overlayLight: 'rgba(255, 255, 255, 0.7)',

    // Shadow Colors
    shadow: 'rgba(15, 23, 42, 0.1)',
    shadowLight: 'rgba(15, 23, 42, 0.05)',
};

// Gradient Definitions for Premium Effects
export const Gradients = {
    primary: ['#0F172A', '#1E293B'] as const,           // Slate 900 to Slate 800
    secondary: ['#F43F5E', '#EC4899'] as const,         // Rose to Pink
    success: ['#22C55E', '#10B981'] as const,           // Green to Emerald
    warning: ['#F59E0B', '#F97316'] as const,           // Amber to Orange
    danger: ['#EF4444', '#DC2626'] as const,            // Red to Dark Red

    // Special Gradients
    glucose: {
        normal: ['#354239ff', '#323534ff'] as const,        // Green gradient
        medium: ['#F59E0B', '#F97316'] as const,        // Orange gradient
        high: ['#F43F5E', '#EC4899'] as const,          // Pink gradient
        low: ['#EF4444', '#DC2626'] as const,           // Red gradient
    },

    // Background Gradients
    background: ['#F8FAFC', '#F1F5F9'] as const,        // Light slate gradient
    card: ['#FFFFFF', '#F8FAFC'] as const,              // White to light slate

    // Premium Effects
    shimmer: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)'] as const,
    glow: ['rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 0)'] as const,

    // Premium Grey Gradients - Elegant & Modern
    elegantGrey: ['#F8FAFC', '#E2E8F0', '#CBD5E1'] as const,      // Light to medium grey
    silverMist: ['#F1F5F9', '#E2E8F0', '#CBD5E1'] as const,       // Silver tones
    platinumGlow: ['#FFFFFF', '#F8FAFC', '#F1F5F9'] as const,     // White to light grey
    charcoalLux: ['#475569', '#334155', '#1E293B'] as const,      // Dark grey luxury

    // Sophisticated Multi-tone Greys
    neutralElegance: ['#FAFAFA', '#F4F4F5', '#E4E4E7'] as const,  // Neutral grey palette
    stoneGradient: ['#F5F5F5', '#E5E5E5', '#D4D4D4'] as const,    // Stone grey
    slateFusion: ['#F8FAFC', '#F1F5F9', '#303945ff', '#CBD5E1'] as const, // Multi-layer slate

    // Premium Dark Greys
    graphitePremium: ['#52525B', '#3F3F46', '#27272A'] as const,  // Graphite tones
    carbonFiber: ['#18181B', '#27272A', '#3F3F46'] as const,      // Carbon inspired

    // Subtle Accent Greys
    pearlWhite: ['#FFFFFF', '#FEFEFE', '#FAFAFA'] as const,       // Pearl finish
    smokeyGlass: ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)', 'rgba(241,245,249,0.85)'] as const,

    // Premium Green Gradients - Nature & Elegance
    emeraldElegant: ['#10B981', '#059669', '#047857'] as const,  // Deep rich emerald
    sageSophisticated: ['#F0FDF4', '#DCFCE7', '#BBF7D0'] as const, // Light sage for backgrounds
    mintLuxury: ['#ECFDF5', '#D1FAE5', '#A7F3D0'] as const,      // Fresh mint
    forestDeep: ['#064E3B', '#065F46', '#047857'] as const,       // Dark forest for contrast

    // Modern Green Accents
    neonNature: ['#34D399', '#10B981', '#059669'] as const,       // Vibrant modern green
    glassGreen: ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'] as const, // Subtle tint
};

export const GlucoseRanges = {
    LOW: 70,           // Below this is hypoglycemia
    TARGET_MIN: 70,    // Normal range minimum
    TARGET_MAX: 140,   // Normal range maximum
    MEDIUM_MAX: 180,   // Above this is high risk
};
