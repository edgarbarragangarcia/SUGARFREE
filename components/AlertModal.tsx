import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Button } from './ui/Button';
import { PredictionResult } from '../services/PredictionEngine';

interface AlertModalProps {
    visible: boolean;
    alert: PredictionResult['alert'];
    onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    visible,
    alert,
    onClose,
}) => {
    if (!alert) return null;

    const getBackgroundColor = () => {
        switch (alert.type) {
            case 'hypoglycemia':
                return Colors.danger;
            case 'hyperglycemia':
                return Colors.secondary;
            case 'warning':
                return Colors.warning;
            default:
                return Colors.primary;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Alert Header */}
                    <View
                        style={[
                            styles.header,
                            { backgroundColor: getBackgroundColor() },
                        ]}
                    >
                        <Text style={styles.alertTitle}>{alert.message}</Text>
                    </View>

                    {/* Alert Content */}
                    <View style={styles.content}>
                        <Text style={styles.actionText}>{alert.action}</Text>

                        {alert.type === 'hypoglycemia' && (
                            <View style={styles.stepsList}>
                                <Text style={styles.stepsTitle}>Pasos Importantes:</Text>
                                <Text style={styles.stepItem}>1. Detén lo que estás haciendo</Text>
                                <Text style={styles.stepItem}>
                                    2. Consume 15g de carbohidratos rápidos
                                </Text>
                                <Text style={styles.stepItem}>3. Espera 15 minutos</Text>
                                <Text style={styles.stepItem}>4. Vuelve a medir tu glucosa</Text>
                                <Text style={styles.stepItem}>
                                    5. Si sigue baja, repite pasos 2-4
                                </Text>
                            </View>
                        )}

                        <Button
                            title="Entendido"
                            size="large"
                            onPress={onClose}
                            style={{ marginTop: 24 }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 28,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
    },
    header: {
        padding: 24,
        alignItems: 'center',
    },
    alertTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.white,
        textAlign: 'center',
    },
    content: {
        padding: 24,
    },
    actionText: {
        fontSize: 18,
        color: Colors.text,
        lineHeight: 26,
        marginBottom: 16,
    },
    stepsList: {
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    stepsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    stepItem: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 8,
        lineHeight: 22,
    },
});
