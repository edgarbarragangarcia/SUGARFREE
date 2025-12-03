export const Colors = {
    primary: '#0D9488',      // Teal for health and calm
    secondary: '#EF4444',    // Red for high risk alerts
    background: '#F8FAFC',   // Clean white/grey
    danger: '#DC2626',       // Dark red for critical alerts
    success: '#10B981',      // Green for positive reinforcement
    warning: '#F59E0B',      // Orange for warnings

    // Glucose level colors
    glucoseNormal: '#10B981',    // Green (70-140 mg/dL)
    glucoseMedium: '#F59E0B',    // Orange (141-180 mg/dL)
    glucoseHigh: '#EF4444',      // Red (>180 mg/dL)
    glucoseLow: '#DC2626',       // Dark red (<70 mg/dL)

    // UI colors
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

export const GlucoseRanges = {
    LOW: 70,           // Below this is hypoglycemia
    TARGET_MIN: 70,    // Normal range minimum
    TARGET_MAX: 140,   // Normal range maximum
    MEDIUM_MAX: 180,   // Above this is high risk
};
