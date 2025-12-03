import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './ui/Card';
import { Colors } from '../constants/Colors';
import { PredictionResult } from '../services/PredictionEngine';

interface PredictiveStatusCardProps {
    currentValue: number;
    prediction: PredictionResult | null;
}

export const PredictiveStatusCard: React.FC<PredictiveStatusCardProps> = ({
    currentValue,
    prediction,
}) => {
    const getRiskColor = () => {
        if (!prediction) return Colors.textLight;

        switch (prediction.riskLevel) {
            case 'critical':
                return Colors.danger;
            case 'high':
                return Colors.secondary;
            case 'medium':
                return Colors.warning;
            case 'low':
                return Colors.success;
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
    const riskColor = getRiskColor();
    const trendIcon = getTrendIcon();

    return (
        <Card noPadding style={{ overflow: 'hidden' }}>
            {/* Header with gradient background */}
            <View
                style={{
                    backgroundColor: riskColor,
                    padding: 20,
                    paddingBottom: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors.white,
                        opacity: 0.9,
                        marginBottom: 8,
                    }}
                >
                    Glucosa Actual
                </Text>
                <Text
                    style={{
                        fontSize: 48,
                        fontWeight: '800',
                        color: Colors.white,
                    }}
                >
                    {currentValue}
                    <Text style={{ fontSize: 24 }}> mg/dL</Text>
                </Text>
            </View>

            {/* Prediction Section */}
            <View style={{ padding: 20, backgroundColor: Colors.white }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Trend Arrow */}
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 40, color: riskColor }}>{trendIcon}</Text>
                        <Text style={{ fontSize: 12, color: Colors.textLight, marginTop: 4 }}>
                            {prediction?.trend === 'rising' ? 'Subiendo' :
                                prediction?.trend === 'falling' ? 'Bajando' : 'Estable'}
                        </Text>
                    </View>

                    {/* Predicted Value */}
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: Colors.textLight,
                                marginBottom: 4,
                            }}
                        >
                            Predicción en 2 horas
                        </Text>
                        <Text
                            style={{
                                fontSize: 36,
                                fontWeight: '700',
                                color: riskColor,
                            }}
                        >
                            {predictedValue}
                            <Text style={{ fontSize: 18 }}> mg/dL</Text>
                        </Text>
                        {prediction && (
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: Colors.textLight,
                                    marginTop: 4,
                                }}
                            >
                                {prediction.confidence}% de confianza
                            </Text>
                        )}
                    </View>
                </View>

                {/* Recommendation */}
                {prediction && (
                    <View
                        style={{
                            marginTop: 16,
                            padding: 12,
                            backgroundColor: Colors.background,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: Colors.text, lineHeight: 20 }}>
                            {prediction.recommendation}
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );
};
