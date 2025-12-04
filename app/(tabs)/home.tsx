import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Gradients } from '../../constants/Colors';
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
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Pulse animation for emergency button
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

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
                    {/* Saludo */}
                    <View style={{ marginBottom: 28 }}>
                        <Text style={{
                            fontSize: 32,
                            fontWeight: '900',
                            color: Colors.text,
                            marginBottom: 6,
                            letterSpacing: -0.5,
                        }}>
                            ¡Hola, {profile?.name ?? 'amigo'}! 👋
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: Colors.textLight,
                            fontWeight: '500',
                        }}>
                            {new Date().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>

                    {/* Predictive Status Card - THE MAIN FEATURE */}
                    <PredictiveStatusCard currentValue={currentValue} prediction={prediction} />

                    {/* Acciones Rápidas */}
                    <View style={{ marginTop: 28, marginBottom: 28 }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '800',
                            color: Colors.text,
                            marginBottom: 16,
                            letterSpacing: 0.3,
                        }}>
                            Acciones Rápidas
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 14 }}>
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
                    <GlucoseChart readings={readings} variant="slate" />

                    {/* Botón de Emergencia con pulse */}
                    <Animated.View
                        style={{
                            marginTop: 28,
                            transform: [{ scale: pulseAnim }],
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setShowAlert(true)}
                            style={{
                                overflow: 'hidden',
                                borderRadius: 28,
                                shadowColor: Colors.danger,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 16,
                                elevation: 8,
                            }}
                        >
                            <LinearGradient
                                colors={Gradients.danger}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    padding: 24,
                                    alignItems: 'center',
                                    borderRadius: 28,
                                }}
                            >
                                <Text style={{
                                    fontSize: 24,
                                    fontWeight: '900',
                                    color: Colors.white,
                                    letterSpacing: 0.5,
                                }}>
                                    🚨 Ayuda de Emergencia
                                </Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: Colors.white,
                                    marginTop: 6,
                                    opacity: 0.95,
                                    fontWeight: '600',
                                }}>
                                    Toca si necesitas asistencia inmediata
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
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
        </LinearGradient>
    );
}
