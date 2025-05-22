const nodemailer = require('nodemailer');

const send_EmployeeEmail = async (recipientEmail, subject, content) => {
    try {
        // Create the transporter with GoDaddy SMTP settings
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

        // Send the email
        await transporter.sendMail({
            from: process.env.SMTP_MAIL, // Your "From" email address
            to: recipientEmail,
            subject: subject,
            html: content, // Email body content (HTML)
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email:', error.message);
    }
};

module.exports = send_EmployeeEmail;
