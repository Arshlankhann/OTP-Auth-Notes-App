
const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({
            from: `"Note App" <${config.email.user}>`,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;