const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const messagesFilePath = path.join(__dirname, 'messages.json');

// Ensure the messages file exists
if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([]));
}

app.use(express.static('public'));
app.use(bodyParser.json());

// Retrieve chat messages
app.get('/messages', (req, res) => {
    fs.readFile(messagesFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.json(JSON.parse(data));
    });
});

// Save a new chat message
app.post('/messages', (req, res) => {
    const newMessage = req.body;
    fs.readFile(messagesFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        const messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFile(messagesFilePath, JSON.stringify(messages), (err) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            res.status(201).send('Message saved');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
