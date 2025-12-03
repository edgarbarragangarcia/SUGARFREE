import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
    Animated,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled,
    icon,
    style,
    ...props
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const getGradientColors = (): readonly [string, string, ...string[]] => {
        switch (variant) {
            case 'primary':
                return Gradients.primary;
            case 'secondary':
                return Gradients.secondary;
            case 'danger':
                return Gradients.danger;
            case 'success':
                return Gradients.success;
            case 'outline':
            default:
                return ['transparent', 'transparent'] as const;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') {
            return Colors.primary;
        }
        return Colors.white;
    };

    const getBorderColor = () => {
        if (variant === 'outline') {
            return Colors.primary;
        }
        return 'transparent';
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 10, paddingHorizontal: 20 };
            case 'medium':
                return { paddingVertical: 14, paddingHorizontal: 28 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 36 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'medium':
                return 16;
            case 'large':
                return 18;
        }
    };

    const sizeStyles = getSizeStyles();
    const textColor = getTextColor();
    const fontSize = getFontSize();
    const gradientColors = getGradientColors();
    const borderColor = getBorderColor();

    return (
        <Animated.View
            style={[
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
        >
            <Pressable
                {...props}
                disabled={disabled || loading}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    shadowColor: variant !== 'outline' ? gradientColors[0] : 'transparent',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                }}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        ...sizeStyles,
                        borderRadius: 16,
                        borderWidth: variant === 'outline' ? 2 : 0,
                        borderColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color={textColor} size="small" />
                    ) : (
                        <>
                            {icon && <>{icon}</>}
                            <Text
                                style={{
                                    color: textColor,
                                    fontSize,
                                    fontWeight: '700',
                                    marginLeft: icon ? 8 : 0,
                                    letterSpacing: 0.3,
                                }}
                            >
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
};
