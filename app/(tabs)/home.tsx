import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../store/userStore';
import { useGlucoseStore } from '../../store/glucoseStore';
import { PredictionEngine, PredictionResult } from '../../services/PredictionEngine';
import { PredictiveStatusCard } from '../../components/PredictiveStatusCard';
import { GlucoseChart } from '../../components/charts/GlucoseChart';
import { AlertModal } from '../../components/AlertModal';
import { Button } from '../../components/ui/Button';
import { MockGlucoseData } from '../../constants/MockData';

export default function HomeScreen() {
    const router = useRouter();
    const { profile } = useUserStore();
    const { readings, addReading } = useGlucoseStore();
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    // Load mock data for first-time users
    useEffect(() => {
        if (readings.length === 0) {
            // Add mock data
            MockGlucoseData.forEach((reading) => {
                addReading({
                    value: reading.value,
                    timestamp: reading.timestamp,
                    tag: reading.tag,
                    note: reading.note,
                });
            });
        }
    }, []);

    // Generate prediction whenever readings change
    useEffect(() => {
        if (readings.length > 0) {
            const newPrediction = PredictionEngine.predict(readings);
            setPrediction(newPrediction);

            // Show alert if critical
            if (newPrediction?.alert) {
                setShowAlert(true);
            }
        }
    }, [readings]);

    const latestReading = readings.length > 0 ? readings[0] : null;
    const currentValue = latestReading?.value ?? 100;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Saludo */}
                <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 4 }}>
                    ¡Hola, {profile?.name ?? 'amigo'}! 👋
                </Text>
                <Text style={{ fontSize: 16, color: Colors.textLight, marginBottom: 24 }}>
                    {new Date().toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>

                {/* Predictive Status Card - THE MAIN FEATURE */}
                <PredictiveStatusCard currentValue={currentValue} prediction={prediction} />

                {/* Acciones Rápidas */}
                <View style={{ marginTop: 24, marginBottom: 24 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 }}>
                        Acciones Rápidas
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Button
                            title="Registrar Glucosa"
                            variant="primary"
                            size="medium"
                            onPress={() => router.push('/(tabs)/log')}
                            style={{ flex: 1 }}
                        />
                        <Button
                            title="Ver Análisis"
                            variant="outline"
                            size="medium"
                            onPress={() => router.push('/(tabs)/insights')}
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>

                {/* Gráfico de 7 Días */}
                <GlucoseChart readings={readings} />

                {/* Botón de Emergencia */}
                <TouchableOpacity
                    style={{
                        marginTop: 24,
                        backgroundColor: Colors.danger,
                        borderRadius: 12,
                        padding: 20,
                        alignItems: 'center',
                    }}
                    onPress={() => setShowAlert(true)}
                >
                    <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.white }}>
                        🚨 Ayuda de Emergencia
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.white, marginTop: 4, opacity: 0.9 }}>
                        Toca si necesitas asistencia inmediata
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Alert Modal */}
            {prediction?.alert && (
                <AlertModal
                    visible={showAlert}
                    alert={prediction.alert}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </SafeAreaView>
    );
}
