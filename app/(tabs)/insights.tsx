import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';
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
        '📊 Tus niveles de glucosa han estado estables la última semana.',
        '🌟 85% de tus registros están en el rango objetivo (70-140 mg/dL).',
        '🕐 Tus niveles en ayunas son consistentemente buenos.',
        '💡 Considera registrar más seguido después de comer para mejores predicciones.',
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Weekly Summary */}
                <Card title="Resumen Semanal">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <StatItem label="Promedio" value={`${average} mg/dL`} color={Colors.primary} />
                        <StatItem label="Más Alto" value={`${highest} mg/dL`} color={Colors.secondary} />
                        <StatItem label="Más Bajo" value={`${lowest} mg/dL`} color={Colors.success} />
                    </View>
                </Card>

                {/* AI Insights */}
                <Card title="Análisis Inteligente" style={{ marginTop: 20 }}>
                    {insights.map((insight, index) => (
                        <View
                            key={index}
                            style={{
                                paddingVertical: 12,
                                borderBottomWidth: index < insights.length - 1 ? 1 : 0,
                                borderBottomColor: Colors.border,
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors.text, lineHeight: 22 }}>
                                {insight}
                            </Text>
                        </View>
                    ))}
                </Card>

                {/* Historical Chart */}
                <View style={{ marginTop: 20 }}>
                    <GlucoseChart readings={readings} title="Tendencias Históricas" />
                </View>

                {/* Share Report */}
                <Card title="Compartir Reporte" style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, color: Colors.textLight, marginBottom: 16 }}>
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
    );
}

const StatItem: React.FC<{ label: string; value: string; color: string }> = ({
    label,
    value,
    color,
}) => (
    <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: Colors.textLight, marginBottom: 4 }}>
            {label}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color }}>{value}</Text>
    </View>
);
