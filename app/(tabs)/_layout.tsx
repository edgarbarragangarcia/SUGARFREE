import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 25 : 20,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: Colors.backgroundCard, // Dark card background
                    borderRadius: 25,
                    height: 70,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5, // Stronger shadow for dark mode
                    shadowRadius: 10,
                    borderTopWidth: 0,
                    paddingBottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: Colors.border, // Subtle border
                },
                tabBarItemStyle: {
                    height: 70,
                    paddingTop: 10,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 2,
                },
                headerStyle: {
                    backgroundColor: Colors.background, // Match app background
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: Colors.text, // Light text
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                headerTitleAlign: 'center',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Inicio',
                    headerTitle: 'SugarFree',
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="log"
                options={{
                    title: 'Registro',
                    headerTitle: 'Nuevo Registro',
                    tabBarLabel: 'Registro',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{
                            position: 'absolute',
                            top: -30,
                            left: '50%',
                            marginLeft: -30,
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: Colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            elevation: 5,
                        }}>
                            <Ionicons name="add" size={32} color="white" />
                        </View>
                    ),
                    tabBarLabelStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Análisis',
                    headerTitle: 'Insights IA',
                    tabBarLabel: 'Análisis',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    headerTitle: 'Mi Perfil',
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
