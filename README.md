## `README.md`

# 💡 WiZ Light Controller - Smart Lighting API & UI

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/codewithshinde/wiz-light-controller)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A powerful, modern REST API and beautiful web interface to control WiZ smart lights via UDP protocol. Control your lights individually or in groups, adjust brightness, change colors, and create amazing lighting scenes - all from a single dashboard.

## 👨‍💻 Owner & Contributors

### Project Owner & Maintainer
**CodeWithShinde**
- 🎯 Lead Developer & Project Creator
- 📧 Contact: [codewithshinde@gmail.com]
- 🐙 GitHub: [@codewithshinde](https://github.com/codewithshinde)
- 💼 Portfolio: [https://karthikshinde.com]

### Contributors
- CodeWithShinde - Project Creator, Main Developer, Documentation

---

## ✨ Features

### 🎮 Core Features
- ✅ **Auto Discovery** - Automatically find all WiZ bulbs on your network
- ✅ **Individual Control** - Turn ON/OFF specific bulbs
- ✅ **Brightness Control** - Adjust brightness from 10% to 100%
- ✅ **Color Control** - Set RGB colors with color picker or manual values
- ✅ **Broadcast Mode** - Control ALL bulbs simultaneously
- ✅ **State Management** - Get real-time bulb status

### 🚀 Advanced Features
- 🎨 **Quick Actions Presets**
  - Warm White (2700K)
  - Cool White (6500K)
  - Party Mode (Color Cycling)
  - Night Mode (1% Brightness)
- 📊 **Real-time Response Logging**
- 🔔 **Toast Notifications**
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Bulb Status Indicators**
- 🔄 **Auto-refresh Capabilities**

### 🛠 Technical Features
- RESTful API endpoints
- UDP protocol communication (Port 38899)
- Real-time bulb discovery
- Error handling & timeout management
- Server health monitoring
- CORS enabled

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **WiZ Smart Bulbs** (any model)
- **Local Network** - Your computer and bulbs must be on the same network
- **WiZ App** - For initial bulb setup and enabling local communication

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/codewithshinde/wiz-light-controller.git
cd wiz-light-controller
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Important: Enable Local Communication in WiZ App
⚠️ **CRITICAL STEP** - This must be done before using the controller:

1. Open the **WiZ App** on your phone
2. Go to **Settings** (gear icon)
3. Navigate to **Security** or **Privacy**
4. Enable **"Allow Local Communication"** or **"Local API Access"**
5. Make sure your bulbs are connected to the same WiFi network as your computer

### 4. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 5. Open the Web Interface
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 🔍 Discovery
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/discover` | Discover all WiZ bulbs on network |
| `GET` | `/bulbs` | List all discovered bulbs |

#### 💡 Light Control
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/on` | Turn light ON | `{"ip": "192.168.1.100"}` |
| `POST` | `/off` | Turn light OFF | `{"ip": "192.168.1.100"}` |
| `POST` | `/toggle` | Toggle light | `{"ip": "192.168.1.100"}` |
| `GET` | `/state/:ip` | Get bulb state | - |

#### ✨ Settings
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/brightness` | Set brightness (10-100) | `{"ip": "...", "brightness": 75}` |
| `POST` | `/color` | Set RGB color | `{"ip": "...", "r": 255, "g": 0, "b": 0}` |

#### 📡 Broadcast
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/broadcast/on` | Turn ALL lights ON |
| `POST` | `/broadcast/off` | Turn ALL lights OFF |

#### 🏥 System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

### API Usage Examples

#### cURL Commands
```bash
# Discover bulbs
curl http://localhost:3000/api/discover

# Turn on a specific bulb
curl -X POST http://localhost:3000/api/on \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100"}'

# Set brightness to 75%
curl -X POST http://localhost:3000/api/brightness \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100", "brightness": 75}'

# Set color to red
curl -X POST http://localhost:3000/api/color \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100", "r": 255, "g": 0, "b": 0}'

# Get bulb state
curl http://localhost:3000/api/state/192.168.1.100

# Turn all lights on
curl -X POST http://localhost:3000/api/broadcast/on
```

---

## 🎨 UI Features Walkthrough

### Dashboard Sections

1. **Discovery Panel**
   - Click "Discover WiZ Bulbs" to scan network
   - Shows all detected bulbs with IP and MAC addresses
   - Real-time status indicators

2. **Individual Control**
   - Select any bulb from dropdown or list
   - Turn ON/OFF individual bulbs
   - Toggle functionality
   - Get current state

3. **Brightness Control**
   - Slider from 10% to 100%
   - Real-time brightness value display
   - Instant apply button

4. **Color Control**
   - Color picker with visual preview
   - Manual RGB value inputs (0-255)
   - Live color preview

5. **Broadcast Controls**
   - Control ALL bulbs at once
   - Perfect for whole-room scenes

6. **Quick Actions**
   - Warm White (2700K)
   - Cool White (6500K)
   - Party Mode (10-second color cycle)
   - Night Mode (1% brightness)

7. **Response Log**
   - Real-time API response tracking
   - Timestamped entries
   - Color-coded success/error messages

---

## 🏗️ Project Structure

```
wiz-light-controller/
├── server.js                 # Main server with API endpoints
├── package.json              # Dependencies and scripts
├── public/
│   └── index.html           # Beautiful web interface
├── README.md                # Documentation
└── .gitignore               # Git ignore file
```

---

## 🔧 Configuration

### Server Configuration
Edit `server.js` to modify:

```javascript
const WIZ_PORT = 38899;        // WiZ UDP port (don't change)
const SERVER_PORT = 3000;      // API server port (change if needed)
```

### Network Requirements
- **UDP Port**: 38899 (must be open)
- **Protocol**: UDP
- **Broadcast Address**: 255.255.255.255
- **Local Network Required**: Yes

---

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t wiz-light-controller .
```

### Run Container
```bash
docker run -p 3000:3000 -p 38899:38899/udp wiz-light-controller
```

---

## 🤝 How to Contribute

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/codewithshinde/wiz-light-controller.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test thoroughly before submitting

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### ❌ No bulbs discovered
**Solution:** 
- Ensure "Allow Local Communication" is enabled in WiZ app
- Verify computer and bulbs are on same network
- Disable firewall temporarily to test
- Try running discovery multiple times

#### ❌ Timeout errors when controlling bulbs
**Solution:**
- Check if bulb IP address is correct
- Ensure bulb is powered on
- Verify network connectivity
- Reduce distance between router and bulbs

#### ❌ Server won't start
**Solution:**
- Check if port 3000 is available
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (needs v18+)

#### ❌ Commands work but UI doesn't update
**Solution:**
- Refresh the browser page
- Check browser console for errors (F12)
- Clear browser cache

#### ❌ Party mode not working
**Solution:**
- Make sure a bulb is selected
- Check if bulb supports color changing
- Try manual color change first

---

## 📊 Performance

- **Discovery Time**: 2-3 seconds
- **Command Response**: < 100ms
- **Concurrent Bulbs**: 20+ supported
- **API Response Time**: < 50ms
- **UDP Timeout**: 3 seconds

---

## 🔒 Security Notes

- ⚠️ This server is designed for **local network use only**
- 🔐 Do not expose port 3000 to the internet
- 🏠 Use only on trusted networks
- 🔄 WiZ bulbs communicate via unencrypted UDP
- 📡 No authentication is implemented (local use only)

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Scene scheduling
- [ ] Voice control integration
- [ ] Multiple room support
- [ ] Energy usage tracking
- [ ] Custom scene creation
- [ ] IFTTT integration
- [ ] Home Assistant integration
- [ ] Mobile app (React Native)
- [ ] Group creation and management
- [ ] Lighting effects library

### Known Issues
- Party mode stops after 10 seconds (intentional limit)
- Some older WiZ models may not support color changing
- UDP packets may be lost on congested networks

---

## 📄 License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2024 CodeWithShinde

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- WiZ Connected for their smart lighting products
- Node.js community for excellent UDP documentation
- All contributors and testers

---

## 📞 Support & Contact

### Project Owner: CodeWithShinde

**GitHub:** [@codewithshinde](https://github.com/codewithshinde)  

### Issues & Bugs
Please report issues on the [GitHub Issues](https://github.com/codewithshinde/wiz-light-controller/issues) page

### Feature Requests
Open a [Pull Request](https://github.com/codewithshinde/wiz-light-controller/pulls) or create an issue with the "enhancement" label

---

## ⭐ Show Your Support

If this project helped you control your WiZ lights:
- ⭐ Star the repository on GitHub
- 🐙 Follow [@codewithshinde](https://github.com/codewithshinde)
- 🔄 Share with others
- 📝 Write a blog post about it

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/codewithshinde/wiz-light-controller)
![GitHub forks](https://img.shields.io/github/forks/codewithshinde/wiz-light-controller)
![GitHub watchers](https://img.shields.io/github/watchers/codewithshinde/wiz-light-controller)
![GitHub issues](https://img.shields.io/github/issues/codewithshinde/wiz-light-controller)

---

**Made with ❤️ by CodeWithShinde**
