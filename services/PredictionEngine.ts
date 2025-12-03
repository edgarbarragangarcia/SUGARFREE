import { GlucoseReading } from '../constants/MockData';
import { GlucoseRanges } from '../constants/Colors';

export interface PredictionResult {
    predictedValue: number;      // Predicted glucose in 2 hours (mg/dL)
    confidence: number;           // 0-100% confidence level
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    trend: 'rising' | 'falling' | 'stable';
    recommendation: string;
    alert?: {
        type: 'hypoglycemia' | 'hyperglycemia' | 'warning';
        message: string;
        action: string;
    };
}

/**
 * MOCK PREDICTION ENGINE
 * 
 * This is a simplified prediction algorithm for MVP demonstration.
 * In production, this should be replaced with:
 * 1. Machine Learning models (TensorFlow Lite, ML Kit)
 * 2. Backend API integration with proper medical algorithms
 * 3. Patient-specific model training
 * 
 * Current Logic:
 * - Analyzes the last 3-5 glucose readings
 * - Calculates rate of change (trend)
 * - Extrapolates 2-hour prediction based on trend
 * - Applies dampening factor (glucose changes slow down over time)
 * - Provides alerts and recommendations based on thresholds
 */
export class PredictionEngine {

    /**
     * Generate a prediction based on recent glucose readings
     */
    static predict(readings: GlucoseReading[]): PredictionResult | null {
        if (readings.length === 0) {
            return null;
        }

        // Get the most recent reading
        const latest = readings[0];
        const currentValue = latest.value;

        // If we don't have enough historical data, use simple heuristics
        if (readings.length < 2) {
            return this.generateSimplePrediction(currentValue);
        }

        // Use last 3-5 readings for trend analysis
        const recentReadings = readings.slice(0, Math.min(5, readings.length));

        // Calculate trend and rate of change
        const { trend, rateOfChange } = this.calculateTrend(recentReadings);

        // Predict value in 2 hours (with dampening)
        const hoursAhead = 2;
        const dampeningFactor = 0.6; // Glucose changes slow down over time
        const predictedValue = Math.round(
            currentValue + (rateOfChange * hoursAhead * dampeningFactor)
        );

        // Calculate confidence based on trend consistency
        const confidence = this.calculateConfidence(recentReadings);

        // Determine risk level
        const riskLevel = this.determineRiskLevel(currentValue, predictedValue);

        // Generate recommendation and alerts
        const { recommendation, alert } = this.generateRecommendation(
            currentValue,
            predictedValue,
            trend
        );

        return {
            predictedValue,
            confidence,
            riskLevel,
            trend,
            recommendation,
            alert,
        };
    }

    /**
     * Calculate trend and rate of change from readings
     */
    private static calculateTrend(readings: GlucoseReading[]): {
        trend: 'rising' | 'falling' | 'stable';
        rateOfChange: number;
    } {
        if (readings.length < 2) {
            return { trend: 'stable', rateOfChange: 0 };
        }

        // Calculate average rate of change per hour
        let totalChange = 0;
        let totalHours = 0;

        for (let i = 0; i < readings.length - 1; i++) {
            const current = readings[i];
            const previous = readings[i + 1];

            const valueChange = current.value - previous.value;
            const timeChange = (current.timestamp - previous.timestamp) / (1000 * 60 * 60); // Convert to hours

            if (timeChange > 0) {
                totalChange += valueChange;
                totalHours += timeChange;
            }
        }

        const rateOfChange = totalHours > 0 ? totalChange / totalHours : 0;

        // Determine trend (stable if change is less than 5 mg/dL per hour)
        let trend: 'rising' | 'falling' | 'stable';
        if (rateOfChange > 5) {
            trend = 'rising';
        } else if (rateOfChange < -5) {
            trend = 'falling';
        } else {
            trend = 'stable';
        }

        return { trend, rateOfChange };
    }

    /**
     * Calculate confidence level based on trend consistency
     */
    private static calculateConfidence(readings: GlucoseReading[]): number {
        if (readings.length < 3) {
            return 60; // Low confidence with limited data
        }

        // Check consistency of trend direction
        const changes: number[] = [];
        for (let i = 0; i < readings.length - 1; i++) {
            changes.push(readings[i].value - readings[i + 1].value);
        }

        // If all changes have the same sign (all positive or all negative), confidence is higher
        const allPositive = changes.every(c => c >= 0);
        const allNegative = changes.every(c => c <= 0);

        if (allPositive || allNegative) {
            return 85; // High confidence - consistent trend
        } else {
            return 70; // Medium confidence - mixed trend
        }
    }

    /**
     * Determine risk level based on current and predicted values
     */
    private static determineRiskLevel(
        current: number,
        predicted: number
    ): 'low' | 'medium' | 'high' | 'critical' {
        // Critical: Hypoglycemia (current or predicted)
        if (current < GlucoseRanges.LOW || predicted < GlucoseRanges.LOW) {
            return 'critical';
        }

        // High: Hyperglycemia (>180 mg/dL)
        if (current > GlucoseRanges.MEDIUM_MAX || predicted > GlucoseRanges.MEDIUM_MAX) {
            return 'high';
        }

        // Medium: Approaching limits
        if (
            current > GlucoseRanges.TARGET_MAX ||
            predicted > GlucoseRanges.TARGET_MAX ||
            current < 80 ||
            predicted < 80
        ) {
            return 'medium';
        }

        // Low: In target range
        return 'low';
    }

    /**
     * Generate recommendation and alert based on glucose values
     */
    private static generateRecommendation(
        current: number,
        predicted: number,
        trend: 'rising' | 'falling' | 'stable'
    ): {
        recommendation: string;
        alert?: PredictionResult['alert'];
    } {
        // CRITICAL: Alerta de hipoglucemia
        if (current < GlucoseRanges.LOW) {
            return {
                recommendation: 'Toma acción inmediata para elevar tu glucosa.',
                alert: {
                    type: 'hypoglycemia',
                    message: 'ALERTA DE HIPOGLUCEMIA',
                    action: 'Consume 15g de carbohidratos de acción rápida (jugo, tabletas de glucosa) inmediatamente. Vuelve a medir en 15 minutos.',
                },
            };
        }

        // Advertencia: Hipoglucemia predicha
        if (predicted < GlucoseRanges.LOW && trend === 'falling') {
            return {
                recommendation: 'Tu glucosa está bajando. Considera tomar un refrigerio.',
                alert: {
                    type: 'warning',
                    message: 'ADVERTENCIA DE GLUCOSA BAJA',
                    action: 'Tu glucosa puede bajar de 70 mg/dL en las próximas 2 horas. Ten un refrigerio pequeño listo.',
                },
            };
        }

        // Alto: Hiperglucemia
        if (current > GlucoseRanges.MEDIUM_MAX) {
            return {
                recommendation: 'Glucosa alta. Mantente hidratado y consulta tu plan de cuidados.',
                alert: {
                    type: 'hyperglycemia',
                    message: 'ALERTA DE GLUCOSA ALTA',
                    action: 'Toma agua, haz una caminata ligera y monitorea de cerca. Contacta a tu médico si persiste.',
                },
            };
        }

        // Hiperglucemia predicha
        if (predicted > GlucoseRanges.MEDIUM_MAX && trend === 'rising') {
            return {
                recommendation: 'Tu glucosa está subiendo. Considera actividad ligera.',
                alert: {
                    type: 'warning',
                    message: 'GLUCOSA EN AUMENTO',
                    action: 'Tu glucosa está en tendencia alta. Considera una caminata de 10 minutos o actividad ligera.',
                },
            };
        }

        // Refuerzo positivo para glucosa estable en rango
        if (
            current >= GlucoseRanges.TARGET_MIN &&
            current <= GlucoseRanges.TARGET_MAX &&
            trend === 'stable'
        ) {
            return {
                recommendation: '🎉 ¡Excelente! Tu glucosa está estable y en el rango objetivo.',
            };
        }

        // Por defecto
        return {
            recommendation: 'Tu glucosa está en un rango aceptable. Sigue monitoreando.',
        };
    }

    /**
     * Simple prediction when we don't have historical data
     */
    private static generateSimplePrediction(currentValue: number): PredictionResult {
        const riskLevel = this.determineRiskLevel(currentValue, currentValue);
        const { recommendation, alert } = this.generateRecommendation(
            currentValue,
            currentValue,
            'stable'
        );

        return {
            predictedValue: currentValue,
            confidence: 50, // Low confidence without historical data
            riskLevel,
            trend: 'stable',
            recommendation,
            alert,
        };
    }
}
