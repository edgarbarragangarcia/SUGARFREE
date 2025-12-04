import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Gradients } from '../../constants/Colors';
import { useUserStore } from '../../store/userStore';
import { useGlucoseStore } from '../../store/glucoseStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ProfileScreen() {
    const router = useRouter();
    const { profile, updateProfile, logout } = useUserStore();
    const { clearAllReadings } = useGlucoseStore();

    const [emergencyContactEnabled, setEmergencyContactEnabled] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres salir? Tus datos se guardarán localmente.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            'Borrar Todos los Datos',
            '¿Estás seguro? Esto eliminará todos tus registros de glucosa permanentemente.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Borrar Todo',
                    style: 'destructive',
                    onPress: () => {
                        clearAllReadings();
                        Alert.alert('Éxito', 'Todos los registros han sido eliminados.');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* User Info */}
                <Card title="Información de Perfil" variant="platinum">
                    <View style={{ marginTop: 8 }}>
                        <InfoRow label="Nombre" value={profile?.name ?? 'No definido'} />
                        <InfoRow label="Tipo de Diabetes" value={profile?.diabetesType ?? 'No definido'} />
                        <InfoRow
                            label="Rango Objetivo"
                            value={`${profile?.targetGlucoseMin ?? 70} - ${profile?.targetGlucoseMax ?? 140} mg/dL`}
                        />
                    </View>
                </Card>

                {/* Emergency Contact */}
                <Card title="Contacto de Emergencia" style={{ marginTop: 20 }} variant="graphite">
                    <Text style={{ fontSize: 14, color: Colors.textLight, marginBottom: 16 }}>
                        Activa para enviar alertas a tu contacto de emergencia cuando los niveles sean críticos.
                    </Text>
                    <Button
                        title={emergencyContactEnabled ? 'Activado ✓' : 'Activar Alertas'}
                        variant={emergencyContactEnabled ? 'primary' : 'outline'}
                        size="medium"
                        onPress={() => setEmergencyContactEnabled(!emergencyContactEnabled)}
                    />
                </Card>

                {/* Settings */}
                <Card title="Configuración" style={{ marginTop: 20 }} variant="silver">
                    <Button
                        title="Borrar Datos"
                        variant="danger"
                        size="medium"
                        onPress={handleClearData}
                        style={{ marginBottom: 12 }}
                    />
                    <Button
                        title="Cerrar Sesión"
                        variant="outline"
                        size="medium"
                        onPress={handleLogout}
                    />
                </Card>

                {/* App Info */}
                <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: Colors.textLight }}>
                        SugarFree v1.0.0
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.textLight, marginTop: 4 }}>
                        Control Inteligente de Diabetes
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
        }}
    >
        <Text style={{ fontSize: 16, color: Colors.textLight }}>{label}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>
            {value}
        </Text>
    </View>
);
