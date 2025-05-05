const nodemailer = require('nodemailer');

const send_candidateEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to,
            subject,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error:', error);
    }
};

module.exports = send_candidateEmail;
