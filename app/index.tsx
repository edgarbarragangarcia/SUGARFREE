import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { useUserStore } from '../store/userStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function LoginScreen() {
    const router = useRouter();
    const { profile, setProfile, isLoggedIn } = useUserStore();

    const [name, setName] = useState('');
    const [diabetesType, setDiabetesType] = useState<'Type 1' | 'Type 2'>('Type 2');
    const [targetMin, setTargetMin] = useState('70');
    const [targetMax, setTargetMax] = useState('140');

    // Use Redirect component instead of useEffect for auto-navigation
    if (isLoggedIn && profile?.isProfileComplete) {
        return <Redirect href="/(tabs)/home" />;
    }

    const handleSubmit = () => {
        if (!name.trim()) {
            alert('Por favor ingresa tu nombre');
            return;
        }

        const min = parseInt(targetMin);
        const max = parseInt(targetMax);

        if (isNaN(min) || isNaN(max) || min >= max) {
            alert('Por favor ingresa un rango de glucosa válido');
            return;
        }

        setProfile({
            name: name.trim(),
            diabetesType,
            targetGlucoseMin: min,
            targetGlucoseMax: max,
            isProfileComplete: true,
        });

        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
                    {/* Header */}
                    <View style={{ marginTop: 40, marginBottom: 40 }}>
                        <Text
                            style={{
                                fontSize: 40,
                                fontWeight: '800',
                                color: Colors.primary,
                                textAlign: 'center',
                            }}
                        >
                            SugarFree
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors.textLight,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        >
                            Control Inteligente de Diabetes
                        </Text>
                    </View>

                    {/* Profile Setup Form */}
                    <Card title="¡Bienvenido! Configuremos tu perfil">
                        <Input
                            label="Tu Nombre"
                            value={name}
                            onChangeText={setName}
                            placeholder="Ingresa tu nombre"
                            autoCapitalize="words"
                        />

                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: Colors.text,
                                    marginBottom: 12,
                                }}
                            >
                                Tipo de Diabetes
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Button
                                    title="Tipo 1"
                                    variant={diabetesType === 'Type 1' ? 'primary' : 'outline'}
                                    onPress={() => setDiabetesType('Type 1')}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    title="Tipo 2"
                                    variant={diabetesType === 'Type 2' ? 'primary' : 'outline'}
                                    onPress={() => setDiabetesType('Type 2')}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: Colors.text,
                                marginBottom: 12,
                            }}
                        >
                            Rango Objetivo de Glucosa (mg/dL)
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                            <Input
                                label="Mínimo"
                                value={targetMin}
                                onChangeText={setTargetMin}
                                keyboardType="numeric"
                                placeholder="70"
                                style={{ flex: 1 }}
                            />
                            <Input
                                label="Máximo"
                                value={targetMax}
                                onChangeText={setTargetMax}
                                keyboardType="numeric"
                                placeholder="140"
                                style={{ flex: 1 }}
                            />
                        </View>

                        <Button
                            title="Comenzar"
                            size="large"
                            onPress={handleSubmit}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
