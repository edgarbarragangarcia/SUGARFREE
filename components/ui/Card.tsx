import React, { ReactNode, useEffect, useRef } from 'react';
import { View, Text, ViewProps, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/Colors';

interface CardProps extends ViewProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    noPadding?: boolean;
    variant?: 'default' | 'glass' | 'premium' | 'gradient' | 'platinum' | 'silver' | 'slate' | 'graphite' | 'emerald' | 'sage';
    animated?: boolean;
    accentColor?: readonly [string, string, ...string[]];
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    noPadding = false,
    variant = 'glass',
    animated = true,
    accentColor = Gradients.primary,
    style,
    ...props
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.94)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            // Entry animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 35,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]).start();

            // Continuous shimmer effect
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shimmerAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shimmerAnim, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            fadeAnim.setValue(1);
            scaleAnim.setValue(1);
            translateY.setValue(0);
        }
    }, []);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100],
    });

    const renderCard = () => {
        if (variant === 'gradient') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            padding: 2, // Border thickness
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    {/* Animated Gradient Border */}
                    <LinearGradient
                        colors={[...accentColor, accentColor[0]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 32,
                        }}
                    />

                    {/* Inner Card */}
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 30,
                            padding: noPadding ? 0 : 24,
                            shadowColor: accentColor[0],
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.15,
                            shadowRadius: 40,
                            elevation: 15,
                        }}
                    >
                        {/* Top Accent Line */}
                        <LinearGradient
                            colors={accentColor}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,
                            }}
                        />

                        {title && (
                            <View style={{ marginTop: 8, marginBottom: subtitle ? 8 : 20 }}>
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
                                            marginTop: 6,
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
                </View>
            );
        }

        if (variant === 'glass') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderWidth: 1.5,
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            shadowColor: '#14B8A6',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.08,
                            shadowRadius: 35,
                            elevation: 10,
                        },
                        style,
                    ]}
                >
                    {/* Shimmer Effect */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: -50,
                            left: 0,
                            right: 0,
                            height: 100,
                            transform: [{ translateX: shimmerTranslate }],
                        }}
                    >
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Animated.View>

                    {/* Subtle gradient overlay */}
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.5)', 'rgba(248, 250, 252, 0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />

                    <View style={{ padding: noPadding ? 0 : 24 }}>
                        {title && (
                            <View style={{ marginBottom: subtitle ? 8 : 20 }}>
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
                                            marginTop: 6,
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
                </View>
            );
        }

        if (variant === 'premium') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    {/* Multi-layer shadow container */}
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: accentColor[0],
                            shadowOffset: { width: 0, height: 25 },
                            shadowOpacity: 0.2,
                            shadowRadius: 50,
                            elevation: 20,
                        }}
                    >
                        <LinearGradient
                            colors={['#FFFFFF', '#F0F9FF', '#E0F2FE']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 2,
                                borderColor: 'rgba(20, 184, 166, 0.15)',
                            }}
                        >
                            {/* Glossy top highlight */}
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                }}
                            />

                            <View style={{ padding: noPadding ? 0 : 26 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 10 : 22 }}>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: '900',
                                                color: Colors.text,
                                                letterSpacing: -0.7,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    color: Colors.textLight,
                                                    marginTop: 6,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {subtitle}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                {children}
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Platinum Variant - Ultra Premium White to Grey
        if (variant === 'platinum') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#CBD5E1',
                            shadowOffset: { width: 0, height: 25 },
                            shadowOpacity: 0.25,
                            shadowRadius: 45,
                            elevation: 18,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.platinumGlow}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1.5,
                                borderColor: 'rgba(203, 213, 225, 0.2)',
                            }}
                        >
                            {/* Pearl shimmer effect */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: -80,
                                    left: -50,
                                    right: -50,
                                    height: 150,
                                    transform: [{ translateX: shimmerTranslate }, { rotate: '45deg' }],
                                }}
                            >
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Animated.View>

                            {/* Subtle top highlight */}
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.4 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '40%',
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                }}
                            />

                            <View style={{ padding: noPadding ? 0 : 26 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 10 : 22 }}>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: '900',
                                                color: '#1E293B',
                                                letterSpacing: -0.7,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    color: '#64748B',
                                                    marginTop: 6,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {subtitle}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                {children}
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Silver Variant - Sophisticated Silver Tones
        if (variant === 'silver') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#94A3B8',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.2,
                            shadowRadius: 40,
                            elevation: 15,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.silverMist}
                            start={{ x: 0.2, y: 0 }}
                            end={{ x: 0.8, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1,
                                borderColor: 'rgba(148, 163, 184, 0.15)',
                            }}
                        >
                            {/* Metallic shimmer */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: shimmerAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 0.6],
                                    }),
                                }}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.4)', 'rgba(226,232,240,0.2)', 'rgba(255,255,255,0.4)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Animated.View>

                            {/* Top accent line */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    backgroundColor: 'rgba(203, 213, 225, 0.5)',
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                }}
                            />

                            <View style={{ padding: noPadding ? 0 : 24 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 8 : 20 }}>
                                        <Text
                                            style={{
                                                fontSize: 23,
                                                fontWeight: '800',
                                                color: '#334155',
                                                letterSpacing: -0.6,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: '#64748B',
                                                    marginTop: 6,
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
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Slate Variant - Modern Clean Grey
        if (variant === 'slate') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#475569',
                            shadowOffset: { width: 0, height: 18 },
                            shadowOpacity: 0.15,
                            shadowRadius: 35,
                            elevation: 12,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.slateFusion}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1,
                                borderColor: 'rgba(226, 232, 240, 0.4)',
                            }}
                        >
                            {/* Subtle gradient overlay */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.6)', 'rgba(248,250,252,0.3)', 'rgba(241,245,249,0.2)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: 32,
                                }}
                            />

                            {/* Corner highlight */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 120,
                                    height: 120,
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    borderTopRightRadius: 32,
                                    borderBottomLeftRadius: 100,
                                }}
                            />

                            <View style={{ padding: noPadding ? 0 : 24 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 8 : 20 }}>
                                        <Text
                                            style={{
                                                fontSize: 22,
                                                fontWeight: '800',
                                                color: '#1E293B',
                                                letterSpacing: -0.5,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: '#64748B',
                                                    marginTop: 6,
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
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Graphite Variant - Dark Elegant Grey
        if (variant === 'graphite') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 22 },
                            shadowOpacity: 0.3,
                            shadowRadius: 42,
                            elevation: 20,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.graphitePremium}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1.5,
                                borderColor: 'rgba(113, 113, 122, 0.3)',
                            }}
                        >
                            {/* Subtle light reflection */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                }}
                            />

                            {/* Shimmer on dark surface */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: -60,
                                    left: 0,
                                    right: 0,
                                    height: 120,
                                    transform: [{ translateX: shimmerTranslate }],
                                }}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Animated.View>

                            <View style={{ padding: noPadding ? 0 : 26 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 10 : 22 }}>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: '900',
                                                color: '#F8FAFC',
                                                letterSpacing: -0.7,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    color: '#CBD5E1',
                                                    marginTop: 6,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {subtitle}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                {children}
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            );
        }



        // Emerald Variant - Deep Green Elegance
        if (variant === 'emerald') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#059669',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.3,
                            shadowRadius: 35,
                            elevation: 15,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.emeraldElegant}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            {/* Glassy overlay */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.6 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60%',
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                }}
                            />

                            {/* Organic curve highlight */}
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: -50,
                                    right: -50,
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100,
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                }}
                            />

                            <View style={{ padding: noPadding ? 0 : 26 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 10 : 22 }}>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: '900',
                                                color: '#FFFFFF',
                                                letterSpacing: -0.5,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    marginTop: 6,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {subtitle}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                {children}
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Sage Variant - Light Green Sophistication
        if (variant === 'sage') {
            return (
                <View
                    {...props}
                    style={[
                        {
                            borderRadius: 32,
                            overflow: 'hidden',
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 32,
                            shadowColor: '#059669',
                            shadowOffset: { width: 0, height: 15 },
                            shadowOpacity: 0.1,
                            shadowRadius: 30,
                            elevation: 10,
                        }}
                    >
                        <LinearGradient
                            colors={Gradients.sageSophisticated}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 32,
                                borderWidth: 1,
                                borderColor: 'rgba(16, 185, 129, 0.2)',
                            }}
                        >
                            {/* Fresh shine */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: -100,
                                    left: 0,
                                    right: 0,
                                    height: 200,
                                    transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }],
                                    opacity: 0.5,
                                }}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Animated.View>

                            <View style={{ padding: noPadding ? 0 : 24 }}>
                                {title && (
                                    <View style={{ marginBottom: subtitle ? 8 : 20 }}>
                                        <Text
                                            style={{
                                                fontSize: 22,
                                                fontWeight: '800',
                                                color: '#064E3B', // Dark forest green text
                                                letterSpacing: -0.5,
                                            }}
                                        >
                                            {title}
                                        </Text>
                                        {subtitle && (
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: '#059669', // Medium emerald text
                                                    marginTop: 6,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {subtitle}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                {children}
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            );
        }

        // Default variant - Enhanced
        return (
            <View
                {...props}
                style={[
                    {
                        backgroundColor: Colors.white,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.06)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 15 },
                        shadowOpacity: 0.06,
                        shadowRadius: 30,
                        elevation: 8,
                        padding: noPadding ? 0 : 22,
                    },
                    style,
                ]}
            >
                {/* Subtle inner glow */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                    }}
                />

                {title && (
                    <View style={{ marginBottom: subtitle ? 8 : 18 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: Colors.text,
                                letterSpacing: -0.3,
                            }}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: Colors.textLight,
                                    marginTop: 5,
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

