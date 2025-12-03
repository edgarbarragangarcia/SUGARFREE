import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Gradients } from '../../constants/Colors';
import { useGlucoseStore } from '../../store/glucoseStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GlucoseChart } from '../../components/charts/GlucoseChart';

export default function InsightsScreen() {
    const { readings } = useGlucoseStore();

    // Calculate statistics
    const values = readings.map((r) => r.value);
    const average = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;
    const highest = values.length > 0 ? Math.max(...values) : 0;
    const lowest = values.length > 0 ? Math.min(...values) : 0;

    // Mock AI insights
    const insights = [
        { icon: '📊', text: 'Tus niveles de glucosa han estado estables la última semana.' },
        { icon: '🌟', text: '85% de tus registros están en el rango objetivo (70-140 mg/dL).' },
        { icon: '🕐', text: 'Tus niveles en ayunas son consistentemente buenos.' },
        { icon: '💡', text: 'Considera registrar más seguido después de comer para mejores predicciones.' },
    ];

    return (
        <LinearGradient
            colors={Gradients.background}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <ScrollView
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '900',
                        color: Colors.text,
                        marginBottom: 24,
                        letterSpacing: -0.5,
                    }}>
                        Análisis 📈
                    </Text>

                    {/* Weekly Summary */}
                    <Card title="Resumen Semanal" variant="glass">
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 12,
                            gap: 12,
                        }}>
                            <StatItem
                                label="Promedio"
                                value={`${average}`}
                                unit="mg/dL"
                                gradient={Gradients.primary}
                            />
                            <StatItem
                                label="Más Alto"
                                value={`${highest}`}
                                unit="mg/dL"
                                gradient={Gradients.danger}
                            />
                            <StatItem
                                label="Más Bajo"
                                value={`${lowest}`}
                                unit="mg/dL"
                                gradient={Gradients.success}
                            />
                        </View>
                    </Card>

                    {/* AI Insights */}
                    <Card title="Análisis Inteligente" subtitle="Impulsado por IA" style={{ marginTop: 24 }} variant="glass">
                        {insights.map((insight, index) => (
                            <View
                                key={index}
                                style={{
                                    paddingVertical: 14,
                                    paddingHorizontal: 12,
                                    borderRadius: 16,
                                    marginBottom: index < insights.length - 1 ? 10 : 0,
                                    backgroundColor: Colors.glassBackgroundDark,
                                    borderWidth: 1,
                                    borderColor: Colors.glassBorder,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 20, marginRight: 10 }}>
                                        {insight.icon}
                                    </Text>
                                    <Text style={{
                                        fontSize: 15,
                                        color: Colors.textLight,
                                        lineHeight: 22,
                                        flex: 1,
                                        fontWeight: '500',
                                    }}>
                                        {insight.text}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Card>

                    {/* Historical Chart */}
                    <View style={{ marginTop: 24 }}>
                        <GlucoseChart readings={readings} title="Tendencias Históricas" />
                    </View>

                    {/* Share Report */}
                    <Card title="Compartir Reporte" style={{ marginTop: 24 }} variant="glass">
                        <Text style={{ fontSize: 15, color: Colors.textLight, marginBottom: 18, lineHeight: 22 }}>
                            Genera un reporte PDF para compartir con tu médico o familia.
                        </Text>
                        <Button
                            title="Generar Reporte (PDF)"
                            variant="primary"
                            size="medium"
                            onPress={() => alert('📄 ¡Generación de reporte pronto!')}
                        />
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const StatItem: React.FC<{ label: string; value: string; unit: string; gradient: readonly [string, string, ...string[]] }> = ({
    label,
    value,
    unit,
    gradient,
}) => (
    <View style={{ flex: 1 }}>
        <View
            style={{
                overflow: 'hidden',
                borderRadius: 16,
            }}
        >
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    padding: 16,
                    alignItems: 'center',
                    borderRadius: 16,
                    shadowColor: gradient[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                }}
            >
                <Text style={{
                    fontSize: 13,
                    color: Colors.white,
                    marginBottom: 8,
                    fontWeight: '700',
                    opacity: 0.9,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                }}>
                    {label}
                </Text>
                <Text style={{
                    fontSize: 28,
                    fontWeight: '900',
                    color: Colors.white,
                    letterSpacing: -0.5,
                }}>
                    {value}
                </Text>
                <Text style={{
                    fontSize: 12,
                    color: Colors.white,
                    fontWeight: '600',
                    opacity: 0.9,
                    marginTop: 2,
                }}>
                    {unit}
                </Text>
            </LinearGradient>
        </View>
    </View>
);
