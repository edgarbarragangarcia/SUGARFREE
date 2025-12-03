import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
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
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                };
            case 'secondary':
                return {
                    backgroundColor: Colors.background,
                    borderColor: Colors.border,
                };
            case 'danger':
                return {
                    backgroundColor: Colors.danger,
                    borderColor: Colors.danger,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: Colors.primary,
                };
        }
    };

    const getTextColor = () => {
        if (variant === 'secondary' || variant === 'outline') {
            return Colors.text;
        }
        return Colors.white;
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'medium':
                return { paddingVertical: 12, paddingHorizontal: 24 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 32 };
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

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    const textColor = getTextColor();
    const fontSize = getFontSize();

    return (
        <TouchableOpacity
            {...props}
            disabled={disabled || loading}
            style={[
                {
                    borderRadius: 12,
                    borderWidth: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...variantStyles,
                    ...sizeStyles,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
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
                            fontWeight: '600',
                            marginLeft: icon ? 8 : 0,
                        }}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};
