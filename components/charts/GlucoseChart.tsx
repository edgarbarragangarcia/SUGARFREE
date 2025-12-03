import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '../ui/Card';
import { Colors, GlucoseRanges } from '../../constants/Colors';
import { GlucoseReading } from '../../constants/MockData';

interface GlucoseChartProps {
    readings: GlucoseReading[];
    title?: string;
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({
    readings,
    title = 'Tendencia de 7 Días',
}) => {
    if (readings.length === 0) {
        return (
            <Card title={title}>
                <Text style={{ textAlign: 'center', color: Colors.textLight }}>
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
            dataPointRadius: 5,
            label: new Date(reading.timestamp).toLocaleDateString('es-ES', {
                month: 'numeric',
                day: 'numeric',
            }),
        };
    });

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = Math.min(screenWidth - 80, 350);

    return (
        <Card title={title}>
            <View style={{ marginVertical: 16 }}>
                <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={200}
                    spacing={Math.max(40, chartWidth / chartData.length)}
                    color={Colors.primary}
                    thickness={3}
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={20}
                    noOfSections={6}
                    maxValue={Math.max(200, Math.max(...chartData.map((d) => d.value)))}
                    yAxisColor={Colors.border}
                    xAxisColor={Colors.border}
                    yAxisTextStyle={{
                        color: Colors.textLight,
                        fontSize: 10,
                    }}
                    xAxisLabelTextStyle={{
                        color: Colors.textLight,
                        fontSize: 10,
                        width: 50,
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
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: color,
                marginRight: 6,
            }}
        />
        <Text style={{ fontSize: 12, color: Colors.textLight }}>{label}</Text>
    </View>
);
