const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use Google App Password
    }
});

const sendEmailAlert = (to, subject, text) => {
    const mailOptions = { from: '"Wedlink Support" <no-reply@wedlink.com>', to, subject, text };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Email Error:", error);
    });
};

module.exports = sendEmailAlert;