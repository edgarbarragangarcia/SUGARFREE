import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useGlucoseStore } from '../../store/glucoseStore';
import { PredictionEngine } from '../../services/PredictionEngine';
import { GeminiVisionService } from '../../services/GeminiVisionService';
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

    // Estados para análisis de comida
    const [foodImage, setFoodImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [foodAnalysis, setFoodAnalysis] = useState<any>(null);

    const tags: GlucoseTag[] = ['Ayunas', 'Antes de Comer', 'Después de Comer', 'Al Dormir'];

    const pickImage = async (useCamera: boolean) => {
        try {
            let result;

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Se necesita permiso para usar la cámara');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                    base64: true,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Se necesita permiso para acceder a las fotos');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                    base64: true,
                });
            }

            if (!result.canceled && result.assets[0].base64) {
                setFoodImage(result.assets[0].uri);
                await analyzeFood(result.assets[0].base64);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Error al seleccionar imagen');
        }
    };

    const analyzeFood = async (base64Image: string) => {
        setIsAnalyzing(true);
        setFoodAnalysis(null);

        try {
            const analysis = await GeminiVisionService.analyzeFoodImage(base64Image);
            setFoodAnalysis(analysis);

            // Auto-llenar campos basados en el análisis
            if (analysis.estimatedGlucoseImpact) {
                setGlucoseValue(analysis.estimatedGlucoseImpact.toString());
            }

            const noteText = `${analysis.foodName}\n` +
                `IG: ${analysis.estimatedGlycemicIndex} | Carbos: ${analysis.estimatedCarbs}g\n` +
                `${analysis.recommendation}`;
            setNote(noteText);

        } catch (error) {
            console.error('Error analyzing food:', error);
            alert('Error al analizar la comida. Inténtalo de nuevo.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = () => {
        const value = parseFloat(glucoseValue);

        if (isNaN(value) || value <= 0 || value > 600) {
            alert('Por favor ingresa un valor válido (1-600 mg/dL)');
            return;
        }

        // Add the reading
        addReading({
            value,
            timestamp: Date.now(),
            tag: selectedTag,
            note: note.trim() || undefined,
        });

        // Check for immediate alerts
        const newReadings = [
            {
                id: 'temp',
                value,
                timestamp: Date.now(),
                tag: selectedTag,
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
        setFoodImage(null);
        setFoodAnalysis(null);
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
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Food Analysis Section */}
                    <Card title="Análisis de Comida IA" subtitle="Toma una foto para estimar el impacto glucémico" variant="silver">
                        <View style={{ gap: 12 }}>
                            {/* Image Preview */}
                            {foodImage && (
                                <View style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                                    <Image
                                        source={{ uri: foodImage }}
                                        style={{ width: '100%', height: 200 }}
                                        resizeMode="cover"
                                    />
                                    {isAnalyzing && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <ActivityIndicator size="large" color={Colors.primary} />
                                            <Text style={{ color: Colors.text, marginTop: 12 }}>
                                                Analizando comida...
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Food Analysis Results */}
                            {foodAnalysis && !isAnalyzing && (
                                <View style={{
                                    backgroundColor: Colors.backgroundLight,
                                    padding: 16,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: Colors.border,
                                    marginBottom: 12,
                                    shadowColor: Colors.shadow,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 2,
                                }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 8 }}>
                                        {foodAnalysis.foodName}
                                    </Text>
                                    <View style={{ gap: 6 }}>
                                        <Text style={{ color: Colors.text }}>
                                            📊 Índice Glucémico: <Text style={{ fontWeight: '600' }}>{foodAnalysis.estimatedGlycemicIndex}</Text>
                                            {foodAnalysis.estimatedGlycemicIndex < 55 ? ' (Bajo ✅)' :
                                                foodAnalysis.estimatedGlycemicIndex < 70 ? ' (Medio ⚠️)' : ' (Alto 🔴)'}
                                        </Text>
                                        <Text style={{ color: Colors.text }}>
                                            🍞 Carbohidratos: <Text style={{ fontWeight: '600' }}>{foodAnalysis.estimatedCarbs}g</Text>
                                        </Text>
                                        <Text style={{ color: Colors.text }}>
                                            📈 Impacto estimado: <Text style={{ fontWeight: '600' }}>+{foodAnalysis.estimatedGlucoseImpact} mg/dL</Text>
                                        </Text>
                                        <Text style={{ color: Colors.textLight, fontSize: 12, marginTop: 4 }}>
                                            💡 {foodAnalysis.recommendation}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Camera Buttons */}
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Button
                                    title="📷 Cámara"
                                    variant="outline"
                                    size="medium"
                                    onPress={() => pickImage(true)}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    title="🖼️ Galería"
                                    variant="outline"
                                    size="medium"
                                    onPress={() => pickImage(false)}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    </Card>

                    <Card title="Registrar Glucosa" subtitle="Monitorea tu nivel de azúcar" style={{ marginTop: 20 }} variant="graphite">
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
                                        onPress={() => setSelectedTag(tag)}
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
                        <Card title="Registros Recientes" style={{ marginTop: 20 }} variant="platinum">
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
