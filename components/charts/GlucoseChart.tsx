import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '../ui/Card';
import { Colors, GlucoseRanges } from '../../constants/Colors';
import { GlucoseReading } from '../../constants/MockData';

interface GlucoseChartProps {
    readings: GlucoseReading[];
    title?: string;
    variant?: 'default' | 'glass' | 'premium' | 'gradient' | 'platinum' | 'silver' | 'slate' | 'graphite' | 'emerald' | 'sage';
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({
    readings,
    title = 'Tendencia de 7 Días',
    variant = 'slate',
}) => {
    if (readings.length === 0) {
        return (
            <Card title={title} variant={variant}>
                <Text style={{ textAlign: 'center', color: Colors.textLight, fontSize: 15 }}>
                    No hay datos disponibles. ¡Empieza a registrar para ver tu tendencia!
                </Text>
            </Card>
        );
    }

    // Sort readings by timestamp (oldest first for chart)
    const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);

    // Take last 7 days of data
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filteredReadings = sortedReadings.filter(
        (r) => r.timestamp >= sevenDaysAgo
    );

    // Format data for the chart
    const chartData = filteredReadings.map((reading) => {
        // Determine color based on glucose value
        let color = Colors.glucoseNormal;
        if (reading.value < GlucoseRanges.LOW) {
            color = Colors.glucoseLow;
        } else if (reading.value > GlucoseRanges.MEDIUM_MAX) {
            color = Colors.glucoseHigh;
        } else if (reading.value > GlucoseRanges.TARGET_MAX) {
            color = Colors.glucoseMedium;
        }

        return {
            value: reading.value,
            dataPointColor: color,
            dataPointRadius: 6,
            label: new Date(reading.timestamp).toLocaleDateString('es-ES', {
                month: 'numeric',
                day: 'numeric',
            }),
        };
    });

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = Math.min(screenWidth - 80, 350);

    return (
        <Card title={title} variant={variant}>
            <View style={{ marginVertical: 16 }}>
                <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={220}
                    spacing={Math.max(40, chartWidth / chartData.length)}
                    color={Colors.primary}
                    thickness={4}
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={20}
                    noOfSections={6}
                    maxValue={Math.max(200, Math.max(...chartData.map((d) => d.value)))}
                    yAxisColor={Colors.border}
                    xAxisColor={Colors.border}
                    yAxisTextStyle={{
                        color: Colors.textLight,
                        fontSize: 11,
                        fontWeight: '600',
                    }}
                    xAxisLabelTextStyle={{
                        color: Colors.textLight,
                        fontSize: 11,
                        width: 50,
                        fontWeight: '600',
                    }}
                    curved
                    areaChart
                    hideDataPoints={false}
                    rulesType="solid"
                    rulesColor={Colors.border}
                    yAxisLabelSuffix=" mg/dL"
                    showVerticalLines={false}
                />
            </View>

            {/* Legend */}
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 16,
                    gap: 12,
                }}
            >
                <LegendItem color={Colors.glucoseLow} label="Bajo (<70)" />
                <LegendItem color={Colors.glucoseNormal} label="Normal (70-140)" />
                <LegendItem color={Colors.glucoseMedium} label="Medio (141-180)" />
                <LegendItem color={Colors.glucoseHigh} label="Alto (>180)" />
            </View>
        </Card>
    );
};


const LegendItem: React.FC<{ color: string; label: string }> = ({
    color,
    label,
}) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
            style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: color,
                marginRight: 8,
                shadowColor: color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 3,
            }}
        />
        <Text style={{ fontSize: 13, color: Colors.textLight, fontWeight: '600' }}>
            {label}
        </Text>
    </View>
);
