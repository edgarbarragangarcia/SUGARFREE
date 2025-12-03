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
                            backgroundColor: Colors.glassBackgroundDark,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: Colors.glassBorder,
                            shadowColor: Colors.shadow,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 24,
                            elevation: 8,
                            padding: noPadding ? 0 : 20,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    {/* Gradient Border Effect */}
                    <LinearGradient
                        colors={['rgba(20, 184, 166, 0.3)', 'rgba(6, 182, 212, 0.1)', 'transparent']}
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
                        colors={[Colors.backgroundCard, Colors.backgroundLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            padding: noPadding ? 0 : 20,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: Colors.glassBorder,
                            shadowColor: Colors.shadow,
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.4,
                            shadowRadius: 32,
                            elevation: 12,
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
                        backgroundColor: Colors.backgroundCard,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: Colors.border,
                        shadowColor: Colors.shadow,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 12,
                        elevation: 5,
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
