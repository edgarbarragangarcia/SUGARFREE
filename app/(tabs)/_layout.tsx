import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                headerTintColor: Colors.white,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Inicio',
                    headerTitle: 'Panel Principal',
                    tabBarLabel: 'Inicio',
                }}
            />
            <Tabs.Screen
                name="log"
                options={{
                    title: 'Registro',
                    headerTitle: 'Registrar Glucosa',
                    tabBarLabel: 'Registro',
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Análisis',
                    headerTitle: 'Análisis IA',
                    tabBarLabel: 'Análisis',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    headerTitle: 'Mi Perfil',
                    tabBarLabel: 'Perfil',
                }}
            />
        </Tabs>
    );
}
