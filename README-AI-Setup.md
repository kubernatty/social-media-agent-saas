# Social Media Agent - Personal AI Image Generator

An AI-powered social media content generator with Personal AI Studio for creating custom professional images.

## Features

- **Content Generation**: AI-powered LinkedIn content creation
- **Personal AI Studio**: Generate custom professional images using AI
- **Team Management**: Upload photos and manage team members
- **Dual AI Modes**: Demo mode (SVG generation) and Real AI mode (DALL-E 3, Stable Diffusion XL)
- **Content Scheduling**: Schedule posts for optimal engagement times

## Quick Start

1. **Demo Mode (No API Key Required)**
   - Open `standalone.html` in your browser
   - Click on "Personal AI" tab
   - Use the pre-loaded demo team members
   - Click "Generate AI Image (Demo)" to create SVG images

2. **Real AI Mode (Requires API Key)**
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys) or [Replicate](https://replicate.com/account/api-tokens)
   - Toggle to "Real AI Mode" in the Personal AI Studio
   - Enter your API key (OpenAI keys start with `sk-`, Replicate keys start with `r8_`)
   - Generate real AI images

## AI Proxy Server Setup (Recommended for OpenAI)

Due to CORS restrictions, OpenAI API calls from the browser may be blocked. Use the proxy server for reliable access:

### Prerequisites
- Node.js installed on your system

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd /Users/cc/agentic-intelligence/social-media-agent
   cp package-proxy.json package.json
   npm install
   ```

2. **Start the Proxy Server**
   ```bash
   npm start
   # Or for development with auto-restart:
   npm run dev
   ```

3. **Verify Server is Running**
   - Open http://localhost:3001/health in your browser
   - You should see: `{"status":"AI Proxy Server is running","port":3001}`

4. **Use Real AI Mode**
   - The frontend will automatically use the proxy server when available
   - If the proxy server is not running, it will attempt direct API calls

## API Keys

### OpenAI (DALL-E 3)
- Visit: https://platform.openai.com/api-keys
- Create a new API key (starts with `sk-`)
- Costs: ~$0.04 per 1024x1024 image

### Replicate (Stable Diffusion XL)
- Visit: https://replicate.com/account/api-tokens
- Create a new API token (starts with `r8_`)
- Costs: ~$0.0025 per image

## Troubleshooting

### "Error generating image" Issues

1. **Check Console Logs** (F12 → Console)
   - Look for specific error messages
   - Check if API keys are properly configured

2. **Demo Mode Not Working**
   - Ensure team members are loaded (check console)
   - Try refreshing the page
   - Check if JavaScript is enabled

3. **Real AI Mode Issues**
   - Verify API key format (sk- for OpenAI, r8- for Replicate)
   - Check API key permissions and credits
   - For OpenAI: Start the proxy server to avoid CORS issues
   - For Replicate: Direct API calls should work

4. **CORS Errors**
   - Start the AI proxy server: `npm start`
   - Or use Replicate instead of OpenAI
   - Check that localhost:3001 is accessible

### Common Error Messages

- **"Please select a team member"**: Ensure team members are loaded and selected
- **"API access blocked"**: Start the proxy server or check API key
- **"CORS error"**: Use the proxy server for OpenAI API calls
- **"No valid members selected"**: Check team member data in console

## Security Notes

- API keys are stored in browser localStorage
- Use HTTPS in production
- Consider implementing proper authentication for production use
- The proxy server should be secured in production environments