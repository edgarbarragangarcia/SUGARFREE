import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { View } from 'react-native';
import { FloatingMenu } from '../../components/FloatingMenu';

export default function TabsLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: Colors.text,
                    headerTitleStyle: {
                        fontWeight: '700',
                        fontSize: 18,
                    },
                    headerTitleAlign: 'center',
                    tabBarStyle: {
                        display: 'none', // Ocultar la barra nativa
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Inicio',
                        headerTitle: 'SugarFree',
                    }}
                />
                <Tabs.Screen
                    name="insights"
                    options={{
                        title: 'Análisis',
                        headerTitle: 'Insights IA',
                    }}
                />
                <Tabs.Screen
                    name="log"
                    options={{
                        title: 'Registro',
                        headerTitle: 'Nuevo Registro',
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Perfil',
                        headerTitle: 'Mi Perfil',
                    }}
                />
            </Tabs>

            {/* Menú Flotante Personalizado */}
            <FloatingMenu />
        </View>
    );
}
