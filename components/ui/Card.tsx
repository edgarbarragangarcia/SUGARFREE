import React, { ReactNode, useEffect, useRef } from 'react';
import { View, Text, ViewProps, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface CardProps extends ViewProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    noPadding?: boolean;
    variant?: 'default' | 'glass' | 'premium';
    animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    noPadding = false,
    variant = 'glass',
    animated = true,
    style,
    ...props
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        if (animated) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, []);

    const renderCard = () => {
        if (variant === 'glass') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            backgroundColor: Colors.white,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.05)', // Borde muy sutil
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05, // Sombra muy suave
                            shadowRadius: 12,
                            elevation: 4,
                            padding: noPadding ? 0 : 20,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    {/* Gradient Border Effect - Sutil en tema claro */}
                    <LinearGradient
                        colors={['rgba(20, 184, 166, 0.1)', 'transparent']}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                        }}
                    />

                    {title && (
                        <View style={{ marginBottom: subtitle ? 4 : 16 }}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: '800',
                                    color: Colors.text,
                                    letterSpacing: -0.5,
                                }}
                            >
                                {title}
                            </Text>
                            {subtitle && (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: Colors.textLight,
                                        marginTop: 4,
                                    }}
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    )}
                    {children}
                </View>
            );
        }

        if (variant === 'premium') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 24,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <LinearGradient
                        colors={['#FFFFFF', '#F8FAFC']} // Gradiente blanco muy sutil
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            padding: noPadding ? 0 : 20,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.03)',
                            shadowColor: Colors.primary, // Sombra con tinte del color primario
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 10,
                        }}
                    >
                        {title && (
                            <View style={{ marginBottom: subtitle ? 4 : 16 }}>
                                <Text
                                    style={{
                                        fontSize: 22,
                                        fontWeight: '800',
                                        color: Colors.text,
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    {title}
                                </Text>
                                {subtitle && (
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: Colors.textLight,
                                            marginTop: 4,
                                        }}
                                    >
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                        )}
                        {children}
                    </LinearGradient>
                </View>
            );
        }

        // Default variant
        return (
            <View
                {...props}
                style={[
                    {
                        backgroundColor: Colors.white,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: Colors.border,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                        padding: noPadding ? 0 : 20,
                    },
                    style,
                ]}
            >
                {title && (
                    <View style={{ marginBottom: subtitle ? 4 : 16 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: Colors.text,
                            }}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: Colors.textLight,
                                    marginTop: 4,
                                }}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </View>
                )}
                {children}
            </View>
        );
    };

    if (!animated) {
        return renderCard();
    }

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
            }}
        >
            {renderCard()}
        </Animated.View>
    );
};
