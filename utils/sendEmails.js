const nodemailer = require('nodemailer')
const sendEmails = async(recipientEmail , subject , text)=>{
    try{
        
        const transporter = nodemailer.createTransport({
                            host: 'smtpout.secureserver.net',
                            port: 465, // SSL Port
                            secure: true, // Enable SSL
                            auth: {
                                user: 'info@smartstartsl.com', // Your email address
                                pass: 'z+2w43vtq1', // Your SMTP password
                            },
                        });
        
             await transporter.sendMail({
                from : process.env.SMTP_MAIL,
                to : recipientEmail,
                subject : subject,
                html : text,
             })
             console.log("email sent successfully");
    }catch(error)
    { 
        
       console.log(error, "email not sent ");
    }
}


module.exports = sendEmails