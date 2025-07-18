const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// OpenAI DALL-E 3 proxy endpoint
app.post('/api/openai/images', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!apiKey || !apiKey.startsWith('sk-')) {
            return res.status(400).json({ error: 'Valid OpenAI API key required' });
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "standard"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error:', response.status, errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json({ imageUrl: data.data[0].url });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Replicate Stable Diffusion XL proxy endpoint
app.post('/api/replicate/images', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!apiKey || !apiKey.startsWith('r8_')) {
            return res.status(400).json({ error: 'Valid Replicate API key required' });
        }

        // Create prediction
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
                input: {
                    prompt: prompt,
                    width: 1024,
                    height: 1024,
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Replicate API error:', response.status, errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const prediction = await response.json();
        
        // Poll for completion
        let result = prediction;
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds timeout
        
        while ((result.status === 'starting' || result.status === 'processing') && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
                headers: {
                    'Authorization': `Token ${apiKey}`,
                }
            });
            result = await statusResponse.json();
        }

        if (result.status === 'succeeded') {
            res.json({ imageUrl: result.output[0] });
        } else {
            res.status(500).json({ error: `Generation failed: ${result.error || 'Unknown error'}` });
        }
    } catch (error) {
        console.error('Error calling Replicate API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'AI Proxy Server is running', port: PORT });
});

app.listen(PORT, () => {
    console.log(`AI Proxy Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /api/openai/images - DALL-E 3 image generation');
    console.log('  POST /api/replicate/images - Stable Diffusion XL image generation');
    console.log('  GET /health - Health check');
});