const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to encrypt the image
function encryptImage(filePath, password, callback) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(`${filePath}.enc`);

    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
        callback(null, `${filePath}.enc`);
    });

    output.on('error', (err) => {
        callback(err);
    });
}

// Helper function to decrypt the image
function decryptImage(filePath, password, callback) {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(`${filePath}.dec`);

    input.pipe(decipher).pipe(output);

    output.on('finish', () => {
        callback(null, `${filePath}.dec`);
    });

    output.on('error', (err) => {
        callback(err);
    });
}

// Endpoint for image encryption
app.post('/encrypt', upload.single('image'), (req, res) => {
    const password = req.body.password;

    if (!password || !req.file) {
        return res.status(400).send('Password and file are required.');
    }

    encryptImage(req.file.path, password, (err, encryptedFilePath) => {
        if (err) {
            return res.status(500).send('Error encrypting image.');
        }

        res.download(encryptedFilePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }

            // Cleanup temporary files
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(encryptedFilePath);
        });
    });
});

// Endpoint for image decryption
app.post('/decrypt', upload.single('image'), (req, res) => {
    const password = req.body.password;

    if (!password || !req.file) {
        return res.status(400).send('Password and file are required.');
    }

    decryptImage(req.file.path, password, (err, decryptedFilePath) => {
        if (err) {
            return res.status(500).send('Error decrypting image. Ensure the password is correct.');
        }

        res.download(decryptedFilePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }

            // Cleanup temporary files
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(decryptedFilePath);
        });
    });
});

// Endpoint to send email with attachment (Nodemailer)
app.post('/send-email', (req, res) => {
    const { senderEmail, receiverEmail, subject, message, attachmentPath } = req.body;

    if (!senderEmail || !receiverEmail || !attachmentPath) {
        return res.status(400).send('Required fields are missing.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const mailOptions = {
        from: senderEmail,
        to: receiverEmail,
        subject: subject || 'Encrypted Image',
        text: message || 'Here is your encrypted image.',
        attachments: [
            {
                path: attachmentPath,
            },
        ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).send('Failed to send email.');
        }
        res.send('Email sent successfully.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
