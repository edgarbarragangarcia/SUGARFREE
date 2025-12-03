import React, { ReactNode } from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface CardProps extends ViewProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    noPadding = false,
    style,
    ...props
}) => {
    return (
        <View
            {...props}
            style={[
                {
                    backgroundColor: Colors.white,
                    borderRadius: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                    padding: noPadding ? 0 : 20,
                },
                style,
            ]}
        >
            {title && (
                <View style={{ marginBottom: subtitle ? 4 : 12 }}>
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
