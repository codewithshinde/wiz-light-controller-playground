const express = require('express');
const dgram = require('dgram');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));


// Configuration
const WIZ_PORT = 38899;  // WiZ lights listen on this UDP port
const SERVER_PORT = 3000;

// UDP client for sending commands
const udpClient = dgram.createSocket('udp4');

// Store discovered bulbs
let discoveredBulbs = [];

/**
 * Send UDP command to a WiZ light bulb
 * @param {string} ip - IP address of the bulb
 * @param {object} command - Command object to send
 * @returns {Promise} - Resolves with bulb response
 */
function sendWizCommand(ip, command) {
    return new Promise((resolve, reject) => {
        const message = JSON.stringify(command);
        const timeout = setTimeout(() => {
            reject(new Error(`Timeout: No response from bulb at ${ip}`));
        }, 3000);

        const responseHandler = (msg, rinfo) => {
            if (rinfo.address === ip) {
                clearTimeout(timeout);
                udpClient.removeListener('message', responseHandler);
                try {
                    const response = JSON.parse(msg.toString());
                    resolve(response);
                } catch (e) {
                    resolve(msg.toString());
                }
            }
        };

        udpClient.on('message', responseHandler);
        
        udpClient.send(message, WIZ_PORT, ip, (err) => {
            if (err) {
                clearTimeout(timeout);
                udpClient.removeListener('message', responseHandler);
                reject(err);
            }
        });
    });
}

/**
 * Turn a light ON
 * @param {string} ip - IP address of the bulb
 */
async function turnLightOn(ip) {
    const command = {
        method: "setPilot",
        params: {
            state: true
        }
    };
    
    const response = await sendWizCommand(ip, command);
    return response;
}

/**
 * Turn a light OFF
 * @param {string} ip - IP address of the bulb
 */
async function turnLightOff(ip) {
    const command = {
        method: "setPilot",
        params: {
            state: false
        }
    };
    
    const response = await sendWizCommand(ip, command);
    return response;
}

/**
 * Set brightness (10-100)
 */
async function setBrightness(ip, brightness) {
    const command = {
        method: "setPilot",
        params: {
            dimming: Math.min(100, Math.max(10, brightness))
        }
    };
    
    const response = await sendWizCommand(ip, command);
    return response;
}

/**
 * Set RGB color
 */
async function setColor(ip, r, g, b) {
    const command = {
        method: "setPilot",
        params: {
            r: Math.min(255, Math.max(0, r)),
            g: Math.min(255, Math.max(0, g)),
            b: Math.min(255, Math.max(0, b))
        }
    };
    
    const response = await sendWizCommand(ip, command);
    return response;
}

/**
 * Get bulb state
 */
async function getBulbState(ip) {
    const command = {
        method: "getPilot",
        params: {}
    };
    
    const response = await sendWizCommand(ip, command);
    return response;
}

/**
 * Discover bulbs on the network via UDP broadcast
 */
async function discoverBulbs() {
    return new Promise((resolve, reject) => {
        const discoveryClient = dgram.createSocket('udp4');
        const bulbs = new Map();
        const timeout = setTimeout(() => {
            discoveryClient.close();
            resolve(Array.from(bulbs.values()));
        }, 3000);

        discoveryClient.on('message', (msg, rinfo) => {
            try {
                const response = JSON.parse(msg.toString());
                if (response.method === 'registration' && response.result && response.result.mac) {
                    if (!bulbs.has(rinfo.address)) {
                        bulbs.set(rinfo.address, {
                            ip: rinfo.address,
                            mac: response.result.mac,
                            success: response.result.success
                        });
                        console.log(`Discovered bulb: ${rinfo.address} (${response.result.mac})`);
                    }
                }
            } catch (e) {
                // Not a valid response
            }
        });

        discoveryClient.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });

        // Bind to port 0 (let OS assign) and send broadcast
        discoveryClient.bind(0, () => {
            const discoveryCommand = {
                method: "registration",
                params: {
                    phoneMac: "ffffffffffff",  // Broadcast MAC
                    register: false,
                    phoneIp: "0.0.0.0"
                }
            };
            
            const message = JSON.stringify(discoveryCommand);
            discoveryClient.setBroadcast(true);
            discoveryClient.send(message, WIZ_PORT, "255.255.255.255", (err) => {
                if (err) {
                    clearTimeout(timeout);
                    reject(err);
                }
            });
        });
    });
}

// ============= API ENDPOINTS =============

/**
 * GET /api/discover
 * Discover all WiZ bulbs on the network
 */
app.get('/api/discover', async (req, res) => {
    try {
        console.log('Discovering bulbs...');
        const bulbs = await discoverBulbs();
        discoveredBulbs = bulbs;
        res.json({
            success: true,
            count: bulbs.length,
            bulbs: bulbs
        });
    } catch (error) {
        console.error('Discovery error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/on
 * Turn a specific light ON
 * Body: { "ip": "192.168.1.100" }
 */
app.post('/api/on', async (req, res) => {
    const { ip } = req.body;
    
    if (!ip) {
        return res.status(400).json({
            success: false,
            error: "IP address is required"
        });
    }
    
    try {
        const result = await turnLightOn(ip);
        res.json({
            success: true,
            message: `Light at ${ip} turned ON`,
            response: result
        });
    } catch (error) {
        console.error('Error turning light on:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/off
 * Turn a specific light OFF
 * Body: { "ip": "192.168.1.100" }
 */
app.post('/api/off', async (req, res) => {
    const { ip } = req.body;
    
    if (!ip) {
        return res.status(400).json({
            success: false,
            error: "IP address is required"
        });
    }
    
    try {
        const result = await turnLightOff(ip);
        res.json({
            success: true,
            message: `Light at ${ip} turned OFF`,
            response: result
        });
    } catch (error) {
        console.error('Error turning light off:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/toggle
 * Toggle a light ON/OFF
 * Body: { "ip": "192.168.1.100" }
 */
app.post('/api/toggle', async (req, res) => {
    const { ip } = req.body;
    
    if (!ip) {
        return res.status(400).json({
            success: false,
            error: "IP address is required"
        });
    }
    
    try {
        // Get current state first
        const state = await getBulbState(ip);
        const isOn = state.result && state.result.state === true;
        
        if (isOn) {
            await turnLightOff(ip);
            res.json({ success: true, message: `Light at ${ip} turned OFF`, state: false });
        } else {
            await turnLightOn(ip);
            res.json({ success: true, message: `Light at ${ip} turned ON`, state: true });
        }
    } catch (error) {
        console.error('Error toggling light:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/brightness
 * Set brightness
 * Body: { "ip": "192.168.1.100", "brightness": 75 }
 */
app.post('/api/brightness', async (req, res) => {
    const { ip, brightness } = req.body;
    
    if (!ip || brightness === undefined) {
        return res.status(400).json({
            success: false,
            error: "IP address and brightness are required"
        });
    }
    
    if (brightness < 10 || brightness > 100) {
        return res.status(400).json({
            success: false,
            error: "Brightness must be between 10 and 100"
        });
    }
    
    try {
        const result = await setBrightness(ip, brightness);
        res.json({
            success: true,
            message: `Brightness set to ${brightness}%`,
            response: result
        });
    } catch (error) {
        console.error('Error setting brightness:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/color
 * Set RGB color
 * Body: { "ip": "192.168.1.100", "r": 255, "g": 0, "b": 0 }
 */
app.post('/api/color', async (req, res) => {
    const { ip, r, g, b } = req.body;
    
    if (!ip || r === undefined || g === undefined || b === undefined) {
        return res.status(400).json({
            success: false,
            error: "IP address and RGB values are required"
        });
    }
    
    try {
        const result = await setColor(ip, r, g, b);
        res.json({
            success: true,
            message: `Color set to RGB(${r},${g},${b})`,
            response: result
        });
    } catch (error) {
        console.error('Error setting color:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/state/:ip
 * Get current state of a bulb
 */
app.get('/api/state/:ip', async (req, res) => {
    const { ip } = req.params;
    
    try {
        const state = await getBulbState(ip);
        res.json({
            success: true,
            ip: ip,
            state: state.result
        });
    } catch (error) {
        console.error('Error getting state:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/bulbs
 * List discovered bulbs
 */
app.get('/api/bulbs', (req, res) => {
    res.json({
        success: true,
        count: discoveredBulbs.length,
        bulbs: discoveredBulbs
    });
});

/**
 * POST /api/broadcast/on
 * Turn ALL discovered lights ON
 */
app.post('/api/broadcast/on', async (req, res) => {
    if (discoveredBulbs.length === 0) {
        return res.status(400).json({
            success: false,
            error: "No bulbs discovered. Run /api/discover first."
        });
    }
    
    const results = [];
    for (const bulb of discoveredBulbs) {
        try {
            await turnLightOn(bulb.ip);
            results.push({ ip: bulb.ip, success: true });
        } catch (error) {
            results.push({ ip: bulb.ip, success: false, error: error.message });
        }
    }
    
    res.json({
        success: true,
        message: `Attempted to turn on ${results.length} bulbs`,
        results: results
    });
});

/**
 * POST /api/broadcast/off
 * Turn ALL discovered lights OFF
 */
app.post('/api/broadcast/off', async (req, res) => {
    if (discoveredBulbs.length === 0) {
        return res.status(400).json({
            success: false,
            error: "No bulbs discovered. Run /api/discover first."
        });
    }
    
    const results = [];
    for (const bulb of discoveredBulbs) {
        try {
            await turnLightOff(bulb.ip);
            results.push({ ip: bulb.ip, success: true });
        } catch (error) {
            results.push({ ip: bulb.ip, success: false, error: error.message });
        }
    }
    
    res.json({
        success: true,
        message: `Attempted to turn off ${results.length} bulbs`,
        results: results
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        uptime: process.uptime(),
        discoveredBulbs: discoveredBulbs.length
    });
});

// Add a route for the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           WiZ Light Control API Server                   ║
╠══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${SERVER_PORT}        ║
║  UDP Port for bulbs: ${WIZ_PORT}                              ║
╠══════════════════════════════════════════════════════════╣
║  Endpoints:                                              ║
║    GET  /api/discover    - Find all bulbs               ║
║    GET  /api/bulbs       - List discovered bulbs        ║
║    POST /api/on          - Turn light ON                ║
║    POST /api/off         - Turn light OFF               ║
║    POST /api/toggle      - Toggle light                 ║
║    POST /api/brightness  - Set brightness (10-100)      ║
║    POST /api/color       - Set RGB color                ║
║    GET  /api/state/:ip   - Get bulb state               ║
║    POST /api/broadcast/on  - Turn ALL lights ON         ║
║    POST /api/broadcast/off - Turn ALL lights OFF        ║
╚══════════════════════════════════════════════════════════╝
    `);
});

// Cleanup on exit
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    udpClient.close();
    process.exit();
});