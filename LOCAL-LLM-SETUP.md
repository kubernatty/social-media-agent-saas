# Local LLM Setup Guide

## Overview

The Social Media Agent now uses **Ollama** for local AI content generation, providing:
- ✅ **Complete Privacy** - All AI processing happens on your device
- ✅ **No API Costs** - No cloud API fees
- ✅ **Faster Generation** - No network latency
- ✅ **Offline Capability** - Works without internet connection
- ✅ **Backup System** - Falls back to Claude API if needed

## Quick Setup (5 minutes)

### 1. Install Ollama

**On macOS:**
```bash
brew install ollama
```

**On Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**On Windows:**
Download from [ollama.com](https://ollama.com)

### 2. Start Ollama Service

```bash
# Start Ollama (runs on localhost:11434)
brew services start ollama

# Or run manually
ollama serve
```

### 3. Download AI Model

```bash
# Download Llama 3.2 1B (recommended - fast and efficient)
ollama pull llama3.2:1b

# Alternative: Download Llama 3.2 3B (better quality, slower)
ollama pull llama3.2:3b
```

### 4. Test Installation

```bash
# Test the model
ollama run llama3.2:1b "Write a LinkedIn post about AI"
```

### 5. Use the Application

- Open `standalone.html` in your browser
- Click "Generate LinkedIn Post"
- The app will automatically use your local LLM!

## AI Generation Priority

The application uses this intelligent fallback system:

1. **🥇 Primary: Ollama (Local LLM)**
   - Llama 3.2 1B model on your device
   - Complete privacy and no costs
   
2. **🥈 Backup: Claude API**
   - If Ollama is unavailable
   - Requires API key (optional)
   
3. **🥉 Fallback: Templates**
   - If both AI services fail
   - Pre-written professional content

## Model Recommendations

### Llama 3.2 1B (Default)
- **Size:** 1.3 GB
- **Speed:** Very fast (~2-5 seconds)
- **Quality:** Good for business content
- **Memory:** ~4GB RAM required

### Llama 3.2 3B (Better Quality)
- **Size:** 2.0 GB  
- **Speed:** Medium (~5-10 seconds)
- **Quality:** Excellent for professional content
- **Memory:** ~6GB RAM required

### Switch Models
```bash
# To use the 3B model instead, update the code
# Change 'llama3.2:1b' to 'llama3.2:3b' in standalone.html line 1789
```

## Troubleshooting

### ❌ "Connection refused" Error
**Problem:** Ollama service not running
**Solution:**
```bash
brew services start ollama
# Or manually: ollama serve
```

### ❌ "Model not found" Error  
**Problem:** Model not downloaded
**Solution:**
```bash
ollama pull llama3.2:1b
```

### ❌ Slow Generation
**Problem:** Large model or insufficient RAM
**Solutions:**
- Use `llama3.2:1b` instead of `3b`
- Close other applications
- Restart Ollama: `brew services restart ollama`

### ❌ Port 11434 Already in Use
**Problem:** Another process using the port
**Solution:**
```bash
# Kill existing process
lsof -ti:11434 | xargs kill -9

# Restart Ollama
brew services restart ollama
```

## Advanced Configuration

### Custom Models
```bash
# List available models
ollama list

# Pull other models
ollama pull mistral:7b
ollama pull codellama:7b

# Update standalone.html model name accordingly
```

### Memory Optimization
```bash
# Set memory limits
export OLLAMA_HOST=localhost:11434
export OLLAMA_NUM_PARALLEL=1
export OLLAMA_MAX_LOADED_MODELS=1
```

### Performance Tuning
```bash
# Enable Flash Attention (faster on newer Macs)
export OLLAMA_FLASH_ATTENTION=1

# Use quantized cache (uses less memory)
export OLLAMA_KV_CACHE_TYPE=q8_0
```

## Security & Privacy

### Data Privacy
- ✅ All content generation happens locally
- ✅ No data sent to external servers
- ✅ Full control over your AI model
- ✅ GDPR/CCPA compliant by design

### Network Security
- ✅ Ollama runs on localhost only
- ✅ No external API calls required
- ✅ Works in air-gapped environments
- ✅ Enterprise-ready security

## API Endpoints

Ollama provides these local endpoints:

```bash
# Generate content
POST http://localhost:11434/api/generate

# List models  
GET http://localhost:11434/api/tags

# Model info
POST http://localhost:11434/api/show
```

## System Requirements

### Minimum
- **RAM:** 4GB available
- **Storage:** 2GB free space
- **OS:** macOS 10.15+, Ubuntu 18.04+, Windows 10+

### Recommended
- **RAM:** 8GB+ available
- **Storage:** 5GB+ free space  
- **CPU:** Apple Silicon or modern x64
- **SSD:** For faster model loading

## Cost Comparison

| Service | Cost per 1,000 requests | Privacy | Speed |
|---------|-------------------------|---------|-------|
| **Ollama (Local)** | $0.00 | 100% Private | Fast |
| Claude API | ~$3.00 | Cloud Service | Medium |
| OpenAI GPT-4 | ~$30.00 | Cloud Service | Medium |

## Support

### Getting Help
- **Ollama Docs:** [ollama.com/docs](https://ollama.com/docs)
- **Model Hub:** [ollama.com/library](https://ollama.com/library)
- **GitHub Issues:** [github.com/ollama/ollama](https://github.com/ollama/ollama)

### Status Check
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Check model status
ollama ps

# View logs
brew services log ollama
```

## Next Steps

1. **Test Content Generation** - Generate a few LinkedIn posts
2. **Optimize Model** - Try different models based on your needs
3. **Backup Setup** - Optionally add Claude API key for redundancy
4. **Performance Tune** - Adjust settings for your hardware

Your local AI is now ready to generate professional LinkedIn content privately and efficiently! 🚀