const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const {v4: uuidv4} = require('uuid');
const {sendEmail, getStatus} = require('./services/EmailService');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Email-sending endpoint
app.post('/send-email', async (req, res) => {
    const {to, subject, body, userId, requestId} = req.body;

    if(!to || !subject || !body) {
        return res.status(400).json({error: "Missing required fields: to, subject, body"});
    }

    const id = requestId || uuidv4();
    const email = {to, subject, body, userId, requestId: id};

    const result = await sendEmail(email);
    return res.json({requestId: id, ...result});
});

//Check status
app.get('/status/:id', (req, res) => {
    const status = getStatus(req.params.id);
    res.json(status);  
});

app.listen(PORT, () => {
    console.log(`📩 Email service running on port ${PORT}`);
})