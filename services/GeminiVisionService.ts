import Constants from 'expo-constants';

const GOOGLE_AI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_AI_API_KEY || 'AIzaSyCow55mrg4qsLxJ5y2TWoyBl0vbV0if8wI';

interface FoodAnalysisResult {
    foodName: string;
    estimatedGlycemicIndex: number;
    estimatedCarbs: number;
    estimatedGlucoseImpact: number; // mg/dL estimado
    confidence: string;
    recommendation: string;
    ingredients?: string[];
}

export class GeminiVisionService {
    private static API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    /**
     * Analiza una imagen de comida y estima su índice glucémico
     */
    static async analyzeFoodImage(imageBase64: string): Promise<FoodAnalysisResult> {
        try {
            const prompt = `Analiza esta imagen de comida y proporciona la siguiente información en formato JSON:
{
  "foodName": "nombre del alimento principal",
  "estimatedGlycemicIndex": número del índice glucémico estimado (0-100),
  "estimatedCarbs": gramos de carbohidratos estimados,
  "estimatedGlucoseImpact": impacto estimado en glucosa en sangre en mg/dL (0-100),
  "confidence": "alta" | "media" | "baja",
  "recommendation": "recomendación breve para diabéticos",
  "ingredients": ["lista", "de", "ingredientes", "visibles"]
}

Si la imagen no contiene comida, responde con un JSON con todos los campos en null y un mensaje en recommendation explicando que no se detectó comida.

IMPORTANTE: 
- El índice glucémico (GI) va de 0-100: Bajo (<55), Medio (55-69), Alto (>70)
- El impacto en glucosa depende del GI y cantidad de carbohidratos
- Sé conservador en las estimaciones para diabéticos
- Responde SOLO con el JSON, sin texto adicional`;

            const response = await fetch(`${this.API_URL}?key=${GOOGLE_AI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                },
                                {
                                    inline_data: {
                                        mime_type: 'image/jpeg',
                                        data: imageBase64
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.4, // Más determinista para análisis técnico
                        maxOutputTokens: 1024,
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Gemini Response:', JSON.stringify(data, null, 2));

            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) {
                throw new Error('No se recibió respuesta del modelo');
            }

            // Extraer JSON de la respuesta (puede venir con markdown)
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se encontró JSON válido en la respuesta');
            }

            const result: FoodAnalysisResult = JSON.parse(jsonMatch[0]);

            // Validación básica
            if (!result.foodName || result.estimatedGlycemicIndex === undefined) {
                throw new Error('Respuesta incompleta del modelo');
            }

            return result;
        } catch (error) {
            console.error('Error analyzing food image:', error);
            throw error;
        }
    }

    /**
     * Analiza múltiples imágenes de comida
     */
    static async analyzeBatchFoodImages(imagesBase64: string[]): Promise<FoodAnalysisResult[]> {
        const results = await Promise.all(
            imagesBase64.map(img => this.analyzeFoodImage(img))
        );
        return results;
    }
}
