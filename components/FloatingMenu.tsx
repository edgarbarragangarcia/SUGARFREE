import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const MENU_ITEMS = [
    { name: 'home', icon: 'home', label: 'Inicio', route: '/home', color: '#3B82F6' }, // Blue
    { name: 'insights', icon: 'stats-chart', label: 'Análisis', route: '/insights', color: '#8B5CF6' }, // Violet
    { name: 'log', icon: 'add-circle', label: 'Registro', route: '/log', color: '#10B981' }, // Emerald
    { name: 'profile', icon: 'person', label: 'Perfil', route: '/profile', color: '#F59E0B' }, // Amber
];

export function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
            friction: 6,
            tension: 50,
        }).start();

        setIsOpen(!isOpen);
    };

    const navigateTo = (route: string) => {
        router.push(route);
        toggleMenu();
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <>
            {/* Overlay de fondo para desenfoque/oscurecimiento */}
            {isOpen && (
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            })
                        }
                    ]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styles.overlayTouchable}
                        activeOpacity={1}
                        onPress={toggleMenu}
                    />
                </Animated.View>
            )}

            <View style={styles.container} pointerEvents="box-none">
                {/* Menu Items */}
                {MENU_ITEMS.map((item, index) => {
                    // Invertimos el índice para que el primero de la lista esté más cerca del botón
                    const reverseIndex = MENU_ITEMS.length - 1 - index;
                    const spacing = 75; // Un poco más de espacio
                    const finalTranslateY = -spacing * (reverseIndex + 1);

                    const translateY = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, finalTranslateY],
                    });

                    const opacity = animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                    });

                    const scale = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                    });


                    return (
                        <Animated.View
                            key={item.name}
                            style={[
                                styles.menuItemContainer,
                                {
                                    opacity,
                                    transform: [
                                        { translateY },
                                        { scale }
                                    ],
                                },
                            ]}
                            pointerEvents={isOpen ? 'auto' : 'none'}
                        >
                            <TouchableOpacity
                                style={styles.menuItemButton}
                                onPress={() => navigateTo(item.route)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.labelContainer}>
                                    <Text style={styles.menuItemLabel}>
                                        {item.label}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: item.color, borderColor: item.color }
                                ]}>
                                    <Ionicons
                                        name={item.icon as any}
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}

                {/* Main Toggle Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={toggleMenu}
                    style={[styles.fab, { backgroundColor: Colors.primary }]}
                >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <Ionicons name="add" size={36} color="#FFFFFF" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: -Dimensions.get('window').height, // Cubrir toda la pantalla desde arriba
        left: -Dimensions.get('window').width,
        width: Dimensions.get('window').width * 2, // Asegurar cobertura total
        height: Dimensions.get('window').height * 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente para tema claro
        zIndex: 9998,
    },
    overlayTouchable: {
        width: '100%',
        height: '100%',
    },
    container: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 10,
    },
    menuItemContainer: {
        position: 'absolute',
        bottom: 10, // Alineado con el centro del FAB (aprox)
        right: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: 250, // Ancho suficiente para el texto
        paddingRight: 10, // Ajuste para alinear centro de icono con centro de FAB
    },
    menuItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    labelContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItemLabel: {
        color: '#1E293B',
        fontSize: 15,
        fontWeight: '600',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 0,
    },
});
