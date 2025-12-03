import React, { ReactNode, useEffect, useRef } from 'react';
import { View, Text, ViewProps, Animated, Platform } from 'react-native';
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
    const scaleAnim = useRef(new Animated.Value(0.96)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        if (animated) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            scaleAnim.setValue(1);
            translateY.setValue(0);
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
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.03)',
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.06,
                            shadowRadius: 24,
                            elevation: 8,
                            padding: noPadding ? 0 : 24,
                        },
                        style,
                    ]}
                >
                    {title && (
                        <View style={{ marginBottom: subtitle ? 8 : 20 }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '700',
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
                                        fontWeight: '500',
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
                            borderRadius: 28,
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 16 },
                            shadowOpacity: 0.12,
                            shadowRadius: 32,
                            elevation: 12,
                            backgroundColor: Colors.white,
                        },
                        style,
                    ]}
                >
                    <LinearGradient
                        colors={['#FFFFFF', '#F0F9FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            padding: noPadding ? 0 : 24,
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: 'rgba(20, 184, 166, 0.1)',
                        }}
                    >
                        {title && (
                            <View style={{ marginBottom: subtitle ? 8 : 20 }}>
                                <Text
                                    style={{
                                        fontSize: 20,
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
                                            fontWeight: '500',
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
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: Colors.border,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.04,
                        shadowRadius: 12,
                        elevation: 3,
                        padding: noPadding ? 0 : 20,
                    },
                    style,
                ]}
            >
                {title && (
                    <View style={{ marginBottom: subtitle ? 6 : 16 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: Colors.text,
                            }}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={{
                                    fontSize: 13,
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
                transform: [
                    { scale: scaleAnim },
                    { translateY: translateY }
                ],
            }}
        >
            {renderCard()}
        </Animated.View>
    );
};
