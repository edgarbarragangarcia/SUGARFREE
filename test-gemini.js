const API_KEY = process.env.GOOGLE_AI_API_KEY || 'YOUR_API_KEY_HERE';

async function testGemini() {
    console.log('🔍 Testing Gemini API...\n');

    // Test 1: Listar modelos disponibles
    console.log('1. Listing available models:');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Available models:');
            data.models.forEach(model => {
                console.log(`   - ${model.name} (supports: ${model.supportedGenerationMethods?.join(', ')})`);
            });
        } else {
            console.log('❌ Error:', data);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('\n2. Testing text generation with gemini-1.5-flash:');
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Hello, how are you?' }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Text generation works!');
            console.log('Response:', data.candidates[0].content.parts[0].text.substring(0, 100) + '...');
        } else {
            console.log('❌ Error:', data);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testGemini();
