import React from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    KeyboardTypeOptions,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    keyboardType?: KeyboardTypeOptions;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    style,
    ...props
}) => {
    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.text,
                        marginBottom: 8,
                    }}
                >
                    {label}
                </Text>
            )}
            <TextInput
                {...props}
                style={[
                    {
                        backgroundColor: Colors.white,
                        borderWidth: 2,
                        borderColor: error ? Colors.danger : Colors.border,
                        borderRadius: 12,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        fontSize: 18, // Large readable text
                        color: Colors.text,
                    },
                    style,
                ]}
                placeholderTextColor={Colors.textLight}
            />
            {error && (
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors.danger,
                        marginTop: 6,
                    }}
                >
                    {error}
                </Text>
            )}
            {helperText && !error && (
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors.textLight,
                        marginTop: 6,
                    }}
                >
                    {helperText}
                </Text>
            )}
        </View>
    );
};
