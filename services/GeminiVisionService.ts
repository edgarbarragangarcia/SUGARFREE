import Constants from 'expo-constants';

const GOOGLE_AI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_AI_API_KEY || 'AIzaSyAFdFeNFrTZOgkwF1_X0Y4Bo--aadgcFv8';

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
    private static API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

            console.log('Calling Gemini API with key:', GOOGLE_AI_API_KEY?.substring(0, 10) + '...');

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
                        temperature: 0.4,
                        maxOutputTokens: 2048, // Aumentado para evitar MAX_TOKENS
                    }
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Gemini API Error:', errorData);
                throw new Error(`API Error ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            console.log('Gemini Full Response:', JSON.stringify(data, null, 2));

            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            console.log('Text Response:', textResponse);

            if (!textResponse) {
                throw new Error('No se recibió respuesta del modelo');
            }

            // Extraer JSON de la respuesta (puede venir con markdown o código)
            let jsonText = textResponse;

            // Remover markdown code blocks si existen
            jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

            // Buscar el JSON
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('No JSON found in response:', textResponse);
                throw new Error('No se encontró JSON válido en la respuesta');
            }

            console.log('Extracted JSON:', jsonMatch[0]);

            const result: FoodAnalysisResult = JSON.parse(jsonMatch[0]);

            console.log('Parsed result:', result);

            // Validación más flexible
            if (!result.foodName && !result.recommendation) {
                console.error('Invalid result structure:', result);
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
