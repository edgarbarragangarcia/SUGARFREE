import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './ui/Card';
import { Colors, Gradients } from '../constants/Colors';
import { PredictionResult } from '../services/PredictionEngine';

interface PredictiveStatusCardProps {
    currentValue: number;
    prediction: PredictionResult | null;
}

export const PredictiveStatusCard: React.FC<PredictiveStatusCardProps> = ({
    currentValue,
    prediction,
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Animate pulse for critical values
    useEffect(() => {
        if (prediction?.riskLevel === 'critical' || prediction?.riskLevel === 'high') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [prediction?.riskLevel]);

    const getRiskGradient = (): readonly [string, string, ...string[]] => {
        if (!prediction) return [Colors.textLight, Colors.textLight] as const;

        switch (prediction.riskLevel) {
            case 'critical':
            case 'high':
                return Gradients.danger;
            case 'medium':
                return Gradients.warning;
            case 'low':
                return Gradients.success;
            default:
                return Gradients.primary;
        }
    };

    const getTrendIcon = () => {
        if (!prediction) return '→';

        switch (prediction.trend) {
            case 'rising':
                return '↗';
            case 'falling':
                return '↘';
            case 'stable':
                return '→';
        }
    };

    const predictedValue = prediction?.predictedValue ?? currentValue;
    const riskGradient = getRiskGradient();
    const trendIcon = getTrendIcon();

    return (
        <Card noPadding style={{ overflow: 'hidden' }} variant="glass">
            {/* Header with gradient background */}
            <LinearGradient
                colors={riskGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    padding: 24,
                    paddingBottom: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors.white,
                        opacity: 0.95,
                        marginBottom: 8,
                        fontWeight: '600',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                    }}
                >
                    Glucosa Actual
                </Text>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Text
                        style={{
                            fontSize: 56,
                            fontWeight: '900',
                            color: Colors.white,
                            letterSpacing: -2,
                        }}
                    >
                        {currentValue}
                        <Text style={{ fontSize: 28, fontWeight: '700' }}> mg/dL</Text>
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Prediction Section with glassmorphism */}
            <View
                style={{
                    padding: 24,
                    backgroundColor: Colors.glassBackground,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Trend Arrow */}
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: Colors.glassBackgroundDark,
                                borderWidth: 2,
                                borderColor: Colors.glassBorder,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Text style={{ fontSize: 32 }}>{trendIcon}</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 13,
                                color: Colors.textLight,
                                fontWeight: '600',
                            }}
                        >
                            {prediction?.trend === 'rising' ? 'Subiendo' :
                                prediction?.trend === 'falling' ? 'Bajando' : 'Estable'}
                        </Text>
                    </View>

                    {/* Predicted Value */}
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 13,
                                color: Colors.textLight,
                                marginBottom: 6,
                                fontWeight: '600',
                                letterSpacing: 0.5,
                            }}
                        >
                            Predicción en 2 horas
                        </Text>
                        <LinearGradient
                            colors={riskGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                padding: 16,
                                paddingHorizontal: 24,
                                borderRadius: 20,
                                marginVertical: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 40,
                                    fontWeight: '900',
                                    color: Colors.white,
                                    textAlign: 'center',
                                    letterSpacing: -1,
                                }}
                            >
                                {predictedValue}
                                <Text style={{ fontSize: 20 }}> mg/dL</Text>
                            </Text>
                        </LinearGradient>
                        {prediction && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 4,
                                }}
                            >
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: Colors.success,
                                        marginRight: 6,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: Colors.textLight,
                                        fontWeight: '600',
                                    }}
                                >
                                    {prediction.confidence}% de confianza
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Recommendation */}
                {prediction && (
                    <View
                        style={{
                            marginTop: 20,
                            padding: 16,
                            backgroundColor: Colors.glassBackgroundDark,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: Colors.glassBorder,
                        }}
                    >
                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ fontSize: 16, marginRight: 6 }}>💡</Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: Colors.text,
                                    letterSpacing: 0.3,
                                }}
                            >
                                Recomendación
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                color: Colors.textLight,
                                lineHeight: 22,
                            }}
                        >
                            {prediction.recommendation}
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );
};
