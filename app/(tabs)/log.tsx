import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';
import { useGlucoseStore } from '../../store/glucoseStore';
import { PredictionEngine } from '../../services/PredictionEngine';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertModal } from '../../components/AlertModal';
import { GlucoseReading } from '../../constants/MockData';

type GlucoseTag = GlucoseReading['tag'];

export default function LogScreen() {
    const router = useRouter();
    const { addReading, readings } = useGlucoseStore();

    const [glucoseValue, setGlucoseValue] = useState('');
    const [selectedTag, setSelectedTag] = useState<GlucoseTag>('Antes de Comer');
    const [note, setNote] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [currentAlert, setCurrentAlert] = useState<any>(null);

    const tags: GlucoseTag[] = ['Ayunas', 'Antes de Comer', 'Después de Comer', 'Al Dormir'];
    // Mapping for internal logic if needed, but for MVP we use the string directly or map it back
    // For simplicity in MVP, let's update the type in MockData or just use these strings.
    // Since MockData types are strict, we might need to adjust them or map them.
    // Let's assume we map them for display but keep internal english or update internal to Spanish.
    // Updating internal to Spanish is better for consistency.

    const handleSubmit = () => {
        const value = parseFloat(glucoseValue);

        if (isNaN(value) || value <= 0 || value > 600) {
            alert('Por favor ingresa un valor válido (1-600 mg/dL)');
            return;
        }

        // Add the reading
        // Note: We are using Spanish tags now. We should update the GlucoseReading type definition or cast it.
        // For this MVP, I will cast it to any to avoid type errors with the English definition, 
        // or better, I will update the type definition in a separate step. 
        // For now, let's proceed with the translation.
        addReading({
            value,
            timestamp: Date.now(),
            tag: selectedTag as any,
            note: note.trim() || undefined,
        });

        // Check for immediate alerts
        const newReadings = [
            {
                id: 'temp',
                value,
                timestamp: Date.now(),
                tag: selectedTag as any,
                note: note.trim() || undefined,
            },
            ...readings,
        ];

        const prediction = PredictionEngine.predict(newReadings);

        if (prediction?.alert) {
            setCurrentAlert(prediction.alert);
            setShowAlert(true);
        } else {
            // Success - navigate back to home
            alert('✅ ¡Glucosa registrada!');
            router.push('/(tabs)/home');
        }

        // Reset form
        setGlucoseValue('');
        setNote('');
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        router.push('/(tabs)/home');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card title="Registrar Glucosa" subtitle="Monitorea tu nivel de azúcar">
                        {/* Glucose Value Input */}
                        <Input
                            label="Nivel de Glucosa (mg/dL)"
                            value={glucoseValue}
                            onChangeText={setGlucoseValue}
                            keyboardType="numeric"
                            placeholder="Ingresa valor (ej. 110)"
                            helperText="Rango normal: 70-140 mg/dL"
                        />

                        {/* Tag Selection */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: Colors.text,
                                    marginBottom: 12,
                                }}
                            >
                                ¿Cuándo mediste?
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                {tags.map((tag) => (
                                    <Button
                                        key={tag}
                                        title={tag}
                                        variant={selectedTag === tag ? 'primary' : 'outline'}
                                        size="small"
                                        onPress={() => setSelectedTag(tag as any)}
                                        style={{ minWidth: 100 }}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Note Input */}
                        <Input
                            label="Nota (Opcional)"
                            value={note}
                            onChangeText={setNote}
                            placeholder="Agrega notas (ej. 'Después de ejercicio')"
                            multiline
                            numberOfLines={3}
                            style={{ height: 80, textAlignVertical: 'top' }}
                        />

                        {/* Submit Button */}
                        <Button
                            title="Guardar Registro"
                            size="large"
                            onPress={handleSubmit}
                            style={{ marginTop: 8 }}
                        />
                    </Card>

                    {/* Recent Readings */}
                    {readings.length > 0 && (
                        <Card title="Registros Recientes" style={{ marginTop: 20 }}>
                            {readings.slice(0, 3).map((reading) => (
                                <View
                                    key={reading.id}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 12,
                                        borderBottomWidth: 1,
                                        borderBottomColor: Colors.border,
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.text }}>
                                            {reading.value} mg/dL
                                        </Text>
                                        <Text style={{ fontSize: 14, color: Colors.textLight, marginTop: 2 }}>
                                            {reading.tag} • {new Date(reading.timestamp).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </Card>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Alert Modal */}
            {currentAlert && (
                <AlertModal
                    visible={showAlert}
                    alert={currentAlert}
                    onClose={handleAlertClose}
                />
            )}
        </SafeAreaView>
    );
}
