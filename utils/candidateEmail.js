const nodemailer = require('nodemailer');

const send_candidateEmail = async ({ to, subject, html }) => {
    try {
         const transporter = nodemailer.createTransport({
                                    host: 'smtpout.secureserver.net',
                                    port: 465, // SSL Port
                                    secure: true, // Enable SSL
                                    auth: {
                                        user: 'info@smartstartsl.com', // Your email address
                                        pass: 'z+2w43vtq1', // Your SMTP password
                                    },
                                    tls: {
                                        rejectUnauthorized: false, // 👈 Accept self-signed certs
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
