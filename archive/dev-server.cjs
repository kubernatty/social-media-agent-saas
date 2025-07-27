#!/usr/bin/env node

/**
 * Development Server for AIfluence
 * 
 * This script starts both the backend API server and serves the frontend
 * standalone.html file for local development.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FRONTEND_PORT = 8080;
const BACKEND_PORT = 3001;

// MIME types for serving files
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
};

// Simple static file server for frontend
function createFrontendServer() {
    return http.createServer((req, res) => {
        console.log(`[Frontend] ${req.method} ${req.url}`);

        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        let filePath = path.join(__dirname, req.url === '/' ? 'standalone.html' : req.url);
        
        // Security check - prevent directory traversal
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                }
                return;
            }

            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'text/plain';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
}

// Start backend server
function startBackendServer() {
    console.log('🚀 Starting backend server...');
    
    const backend = spawn('node', ['server/server.js'], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'development' }
    });

    backend.stdout.on('data', (data) => {
        console.log(`[Backend] ${data.toString().trim()}`);
    });

    backend.stderr.on('data', (data) => {
        console.log(`[Backend Error] ${data.toString().trim()}`);
    });

    backend.on('close', (code) => {
        console.log(`[Backend] Process exited with code ${code}`);
    });

    return backend;
}

// Start frontend server
function startFrontendServer() {
    console.log('🌐 Starting frontend server...');
    
    const server = createFrontendServer();
    
    server.listen(FRONTEND_PORT, () => {
        console.log(`[Frontend] Server running at http://localhost:${FRONTEND_PORT}`);
        console.log(`[Frontend] Serving standalone.html and static files`);
    });

    return server;
}

// Main execution
function main() {
    console.log('🔧 AIfluence Development Server');
    console.log('=====================================');
    
    // Check if required files exist
    if (!fs.existsSync('standalone.html')) {
        console.error('❌ standalone.html not found in current directory');
        process.exit(1);
    }
    
    if (!fs.existsSync('server/server.js')) {
        console.error('❌ server/server.js not found');
        process.exit(1);
    }

    // Start servers
    const backendProcess = startBackendServer();
    const frontendServer = startFrontendServer();

    console.log('');
    console.log('🎉 Development servers started!');
    console.log('=====================================');
    console.log(`📱 Frontend: http://localhost:${FRONTEND_PORT}`);
    console.log(`🔧 Backend:  http://localhost:${BACKEND_PORT}`);
    console.log('');
    console.log('Press Ctrl+C to stop all servers');

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down development servers...');
        
        backendProcess.kill('SIGTERM');
        frontendServer.close(() => {
            console.log('✅ All servers stopped');
            process.exit(0);
        });
    });
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { createFrontendServer, startBackendServer };