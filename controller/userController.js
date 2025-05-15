const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcrypt')
const jobModel = require('../model/jobModel')
const appliedjobModel = require('../model/appliedJobModel')
const sendjobEmail = require('../utils/jobAppliedEmail')
const moment = require("moment");
const cron = require("node-cron");
const send_EmployeeEmail = require('../utils/employeeEmail')
const empNotificationModel = require('../model/employeeNotification')
const privacy_policyModel = require('../model/privacy_policy')
const term_condition = require('../model/term_condition')
const services = require('../model/servicePage')
const stringSimilarity = require('string-similarity');
const cms_job_posting_sectionModel = require('../model/cms_job_posting_section1')
const cms_need_any_job_section_Model = require('../model/cms_need_any_job_section')
const cms_postjobModel = require('../model/cms_post_your_job')
const cms_jobMarketData = require('../model/cms_job_market_data')
const jobTitleModel = require('../model/jobTitle')
const Psychometric_test_Model = require('../model/Psychometric_testing')
const ExcelJs = require("exceljs");
const otpModel = require('../model/otpModel')
const sendEmails = require('../utils/sendEmails')
const adminNotificationModel = require('../model/adminNotification')
const faqModel = require('../model/Faq')
const contactUsModel = require('../model/contact_us')
const jobDescription_model = require('../model/jobDescription')
const ResumeModel = require('../model/uploadResume')
const { countDocuments } = require('../model/Admin_and_staffs')
const blog_section_comment_Model = require('../model/blog_detail_comment')
const path = require('path')
const fixit_finder_model = require('../model/fixit_finder_model')
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const save_candidate_profile = require('../model/save_candidate_profile_for_later')
const psychometric_test_Category_Model = require('../model/psychometric_test_Category')
const CvBuilderModel = require('../model/cv_builder')
const courses_user_enroll_Model = require('../model/courses_enroll_user')
const jobDescription_model2 = require("../model/jobDescription2");

require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');
const validator = require('validator');
const fs = require('fs')
const parse5 = require('parse5');
const cms_online_courses_Model = require('../model/cms_online_cources')
const online_course_quiz_Model = require('../model/online_courses_quiz')
const user_enrolled_course_toic_manage_Model = require('../model/user_enrolled_topic_manage')
const user_enrolled_course_toic_quiz_manage_Model = require('../model/topic_quiz_manage')
const course_transaction_model = require('../model/transaction')

const main_jobTitleModel = require('../model/main_jobTitle')
const clientPackageModel = require('../model/clientPackage')
const package_transaction_model = require('../model/package_transaction')

const sl_loc_model = require('../model/sl_loc_lat_long')
const pdfParse = require('pdf-parse');
const natural = require('natural');
const pdfkit = require("pdfkit")
const mammoth = require('mammoth');
const { execSync } = require('child_process')
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { convert } = require('html-to-text');


// ----------- Text Formatting ----------
const improveTextFormatting = (text) => {
  if (!text || typeof text !== "string") return "";
  text = text.replace(/([.,!?;:])(?=\S)/g, "$1 ");
  text = text.replace(/(\S)([.,!?;:])(\S)/g, "$1$2 $3");
  text = text.replace(/([a-zA-Z])\.(?=\S)/g, "$1. ");
  text = text.replace(/\s{2,}/g, " ");
  text = text.replace(/([A-Z][A-Z\s]+)(\n|$)/g, "\n\n$1\n");
  return text.trim();
};

// ----------- PDF Parsing ---------------
const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  let parsedText = data.text;
  parsedText = parsedText.replace(/(\.)(\s)/g, "$1\n\n");
  parsedText = parsedText.replace(/(\.)(\n)/g, "$1\n\n");
  parsedText = improveTextFormatting(parsedText);

  return parsedText;
};

// ----------- Tokenization + Stemming -------
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const preprocess = (text) => {
  if (!text || typeof text !== "string") return [];
  const tokens = tokenizer.tokenize(text.toLowerCase());
  return tokens.map((word) => stemmer.stem(word));
};

// ----------- Match % Calculation ------------
const calculateMatchPercentage = (cvText, jdText, jobHeading = "") => {
  const cvTokens = preprocess(cvText);
  const jdTokens = preprocess(jdText);

  const cvTfIdf = new natural.TfIdf();
  cvTfIdf.addDocument(cvTokens.join(" "));

  let matchCount = 0;
  jdTokens.forEach((word) => {
    if (cvTfIdf.tfidf(word, 0) > 0) {
      matchCount++;
    }
  });

  let matchPercentage = (matchCount / jdTokens.length) * 100;

  if (matchPercentage < 35) {
    matchPercentage += 10;
  } else if (matchPercentage >= 35 && matchPercentage < 50) {
    matchPercentage += 5;
  }

  return matchPercentage.toFixed(2);
};
/* employer Section */

// Api for user Signup

function isValidEmail(email) {
    // Define the email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Api for client Signup

// const employeeSignup = async (req, res) => {
//     try {
//         var { name, email, password, phone_no, company_name, Number_of_emp, company_industry, company_HQ, package_id} = req.body

//         // check for required fields
//         const requiredFields = ["name", "email", "password", "phone_no", "company_name", "Number_of_emp", "company_industry", "company_HQ", "package_id"];

//         for (const field of requiredFields) {
//             if (!req.body[field]) {
//                 return res
//                     .status(400)
//                     .json({
//                         message: `Missing ${field.replace("_", " ")} `,
//                         success: false,
//                     });
//             }
//         }

//         if (!isValidEmail(email)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please Enter valid Email'
//             })
//         }


//         // check for existing employee
//         const existingEmp = await employeeModel.findOne({ email: email })
//         if (existingEmp) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'email already exists'
//             })
//         }
//         // check for company
//         const existCompany = await employeeModel.findOne({ company_name: company_name }) 
//         if (existCompany) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Company Details already exists'
//             })
//         }
                

//         //hashed the password
//         const hashedPassword = await bcrypt.hash(password, 10)
//         let profileImage = null

//         if (req.file && req.file.filename) {
//             // Get the file extension
//             const fileExtension = path.extname(req.file.filename).toLowerCase();

//             // List of allowed extensions
//             const allowedExtensions = ['.jpg', '.jpeg', '.png'];

//             // Check if the file extension is in the allowed list
//             if (allowedExtensions.includes(fileExtension)) {
//                 // If valid, update the profile image
//                 profileImage = req.file.filename;
//             } else {
//                 // If not valid, throw an error
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
//                 });
//             }
//         }


        
//         // check for package
//         var package = await clientPackageModel.findOne({ _id: package_id })
//         if (!package) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Package Not Found'
//             })
//         }

//         var today = new Date()
//         let package_active_date = today.toISOString()

//         let package_end_date = null
//         if (package.access_portal) {
//             package_end_date = new Date(today)
//             package_end_date.setDate(package_end_date.getDate() + package.access_portal)
//             package_end_date = package_end_date.toISOString()
//         }
//         else {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Package Activation days are missing'
//             })
//         }

//         let newData;


//         if (package.package_type === 'Weekly') {

//             newData = new employeeModel({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 phone_no,
//                 company_name,
//                 Number_of_emp,
//                 company_industry,
//                 profileImage: profileImage || null,
//                 status: 0,
//                 company_HQ: company_HQ,
//                 package_id,
//                 package_name: package.package_name,
//                 package_type: package.package_type,
//                 package_active_date,
//                 package_end_date,

//             })




//             const EmployeeContent = `
//                                                                 <!DOCTYPE html>
//                                 <html lang="en">
//                                 <head>
//                                     <meta charset="UTF-8">
//                                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                                     <title>Account Login Details</title>
//                                 </head>
//                                 <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">

//                                 <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
//                                     <h2 style="text-align: center; color: #4CAF50;">Hello ${name},</h2>
//                                     <p>Thank you for registering with us. Below are your account login details:</p>

//                                     <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
//                                         <tr>
//                                             <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Email</th>
//                                             <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${email}</td>
//                                         </tr>
//                                         <tr>
//                                             <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Password</th>
//                                             <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${password}</td>
//                                         </tr>
//                                         <tr>
//                                             <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Phone Number</th>
//                                             <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${phone_no}</td>
//                                         </tr>
//                                     </table>

//                                     <p>If you have any questions, feel free to reach out to our support team.</p>
//                                 </div>

//                                 </body>
//                                 </html>

//                                `;

//             // Send email to the staff
//             await send_EmployeeEmail(email, `Your Account successfully Created`, EmployeeContent);


//             // send notification to admin
//             try {
//                 const newNotification = adminNotificationModel.create({
//                     title: `New Client`,
//                     message: `New client added successfully! Please activate their account from pending status`,
//                     date: new Date(),
//                     status: 1,
//                 });
//                 newNotification.save();
//             } catch (notificationError) {
//                 console.error('Error creating notification:', notificationError);
//             }
//         }
//         else {

//             newData = new employeeModel({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 phone_no,
//                 company_name,
//                 Number_of_emp,
//                 company_industry,
//                 profileImage: profileImage,
//                 status: 2,
//                 company_HQ: company_HQ,
//                 package_id,
//                 package_name: package.package_name,
//                 package_type: package.package_type,
//                 plain_pwd: password,
//                 package_active_date,
//                 package_end_date,

//             })

//         }
//         await newData.save()

//         return res.status(200).json({
//             success: true,
//             message: 'successfully SignUP',
//             clientId: newData._id,

//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'server error',
//             error_message: error.message
//         })
//     }
// }

const employeeSignup = async (req, res) => {
    try {
        var { name, email, password, phone_no, company_name, Number_of_emp, company_industry, company_HQ, package_id ="6763e1563feea66175a231fb"} = req.body

        // check for required fields
        const requiredFields = ["name", "email", "password", "phone_no", "company_name", "Number_of_emp", "company_industry", "company_HQ"];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        message: `Missing ${field.replace("_", " ")} `,
                        success: false,
                    });
            }
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter valid Email'
            })
        }


        // check for existing employee
        const existingEmp = await employeeModel.findOne({ email: email })
        if (existingEmp) {
            return res.status(400).json({
                success: false,
                message: 'email already exists'
            })
        }
        // check for company
        const existCompany = await employeeModel.findOne({ company_name: company_name }) 
        if (existCompany) {
            return res.status(400).json({
                success: false,
                message: 'Company Details already exists'
            })
        }
                

        //hashed the password
        const hashedPassword = await bcrypt.hash(password, 10)
        let profileImage = null

        if (req.file && req.file.filename) {
            // Get the file extension
            const fileExtension = path.extname(req.file.filename).toLowerCase();

            // List of allowed extensions
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];

            // Check if the file extension is in the allowed list
            if (allowedExtensions.includes(fileExtension)) {
                // If valid, update the profile image
                profileImage = req.file.filename;
            } else {
                // If not valid, throw an error
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                });
            }
        }


        
        // check for package
        var package = await clientPackageModel.findOne({ _id: package_id })
        if (!package) {
            return res.status(400).json({
                success: false,
                message: 'Package Not Found'
            })
        }

        var today = new Date()
        let package_active_date = today.toISOString()

        let package_end_date = null
        if (package.access_portal) {
            package_end_date = new Date(today)
            package_end_date.setDate(package_end_date.getDate() + package.access_portal)
            package_end_date = package_end_date.toISOString()
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Package Activation days are missing'
            })
        }

        let newData;


        if (package.package_type === 'Weekly') {

            newData = new employeeModel({
                name,
                email,
                password: hashedPassword,
                phone_no,
                company_name,
                Number_of_emp,
                company_industry,
                profileImage: profileImage || null,
                status: 0,
                company_HQ: company_HQ,
                package_id,
                package_name: package.package_name,
                package_type: package.package_type,
                package_active_date,
                package_end_date,

            })




            const EmployeeContent = `
                                                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Account Login Details</title>
                                </head>
                                <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">

                                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                    <h2 style="text-align: center; color: #4CAF50;">Hello ${name},</h2>
                                    <p>Thank you for registering with us. Below are your account login details:</p>

                                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                                        <tr>
                                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Email</th>
                                            <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${email}</td>
                                        </tr>
                                        <tr>
                                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Password</th>
                                            <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${password}</td>
                                        </tr>
                                        <tr>
                                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">Phone Number</th>
                                            <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">${phone_no}</td>
                                        </tr>
                                    </table>

                                    <p>If you have any questions, feel free to reach out to our support team.</p>
                                </div>

                                </body>
                                </html>

                               `;

            // Send email to the staff
            await send_EmployeeEmail(email, `Your Account successfully Created`, EmployeeContent);


            // send notification to admin
            try {
                const newNotification = adminNotificationModel.create({
                    title: `New Client`,
                    message: `New client added successfully! Please activate their account from pending status`,
                    date: new Date(),
                    status: 1,
                });
                newNotification.save();
            } catch (notificationError) {
                console.error('Error creating notification:', notificationError);
            }
        }
        else {

            newData = new employeeModel({
                name,
                email,
                password: hashedPassword,
                phone_no,
                company_name,
                Number_of_emp,
                company_industry,
                profileImage: profileImage,
                status: 1,
                company_HQ: company_HQ,
                package_id,
                package_name: package.package_name,
                package_type: package.package_type,
                plain_pwd: password,
                package_active_date,
                package_end_date,

            })

        }
        await newData.save()

        // Send the email
        const emailContent = `
           <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Smart Start SL Ltd</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: navy;">Welcome to Smart Start SL Ltd – Your Journey Begins Here</h2>
        <p><strong>Dear Valuable Client,</strong></p>
        <p>Thank you for signing up with <strong>Smart Start SL Ltd</strong>.</p>
        <p>We are excited to welcome you to a community built on excellence, innovation, and a strong commitment to your success. At <strong>Smart Start SL Ltd</strong>, we don't just deliver HR services, we build strategic partnerships that drive real growth and impact.</p>
        <p>Your registration is the first step toward a powerful, results-driven engagement. Our team will contact you shortly to understand your needs and outline the next steps.</p>
        <p>If you would like to speak with us sooner, feel free to reach out at <a href="mailto:info@smartstart.sl"><strong>info@smartstart.sl</strong></a> or call <strong>+232 88 247000</strong>.</p>
        <p>We look forward to partnering with you and building a successful future together.</p>
        <p><strong>Warm Regards,</strong></p>
        <p><strong>Patricia Olayemi Jangah</strong><br>
        <strong>CEO/Founder</strong><br>
        <strong>Smart Start SL Ltd</strong><br>
        <a href="http://www.smartstartsl.com">www.smartstartsl.com</a><br>
        <a href="mailto:info@smartstart.sl"><strong>info@smartstart.sl</strong></a><br>
        <strong>+232 88 247000</strong></p>
    </div>
</body>
</html>

        `;

        // Send email to the new client
        await send_EmployeeEmail(email, 'Welcome to Smart Start SL Ltd – Your Journey Begins Here', emailContent);



        return res.status(200).json({
            success: true,
            message: 'successfully SignUP',
            clientId: newData._id,

        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

const Client = require('../model/client_model'); // Adjust the path as needed


const clientSignup = async (req, res) => {
    try {
        var { name, email, password, phone_no, company_name, Number_of_emp, company_industry, company_HQ } = req.body;

        // Check for required fields
        const requiredFields = ["name", "email", "password", "phone_no", "company_name", "Number_of_emp", "company_industry", "company_HQ"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    message: `Missing ${field.replace("_", " ")} `,
                    success: false,
                });
            }
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter valid Email'
            });
        }

        // Check for existing client
        const existingClient = await Client.findOne({ email: email });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Check for existing company
        const existCompany = await Client.findOne({ company_name: company_name });
        if (existCompany) {
            return res.status(400).json({
                success: false,
                message: 'Company Details already exist'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        let profileImage = null;

        if (req.file && req.file.filename) {
            // Get the file extension
            const fileExtension = path.extname(req.file.filename).toLowerCase();

            // List of allowed extensions
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];

            // Check if the file extension is in the allowed list
            if (allowedExtensions.includes(fileExtension)) {
                profileImage = req.file.filename;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
                });
            }
        }

        // Create new client data
        let newClientData = new Client({
            name,
            email,
            password: hashedPassword,
            phone_no,
            company_name,
            Number_of_emp,
            company_industry,
            profileImage: profileImage || null,
            status: 0, // Default status for a new client
            company_HQ,
        });

        // Save the client data
        await newClientData.save();

        // Send the email
        const emailContent = `
           <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Smart Start SL Ltd</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: navy;">Welcome to Smart Start SL Ltd – Your Journey Begins Here</h2>
        <p><strong>Dear Valuable Client,</strong></p>
        <p>Thank you for signing up with <strong>Smart Start SL Ltd</strong>.</p>
        <p>We are excited to welcome you to a community built on excellence, innovation, and a strong commitment to your success. At <strong>Smart Start SL Ltd</strong>, we don't just deliver HR services, we build strategic partnerships that drive real growth and impact.</p>
        <p>Your registration is the first step toward a powerful, results-driven engagement. Our team will contact you shortly to understand your needs and outline the next steps.</p>
        <p>If you would like to speak with us sooner, feel free to reach out at <a href="mailto:info@smartstart.sl"><strong>info@smartstart.sl</strong></a> or call <strong>+232 88 247000</strong>.</p>
        <p>We look forward to partnering with you and building a successful future together.</p>
        <p><strong>Warm Regards,</strong></p>
        <p><strong>Patricia Olayemi Jangah</strong><br>
        <strong>CEO/Founder</strong><br>
        <strong>Smart Start SL Ltd</strong><br>
        <a href="http://www.smartstartsl.com">www.smartstartsl.com</a><br>
        <a href="mailto:info@smartstart.sl"><strong>info@smartstart.sl</strong></a><br>
        <strong>+232 88 247000</strong></p>
    </div>
</body>
</html>

        `;

        // Send email to the new client
        await send_EmployeeEmail(email, 'Welcome to Smart Start SL Ltd – Your Journey Begins Here', emailContent);

        return res.status(200).json({
            success: true,
            message: 'Successfully Registered',
            clientId: newClientData._id,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();

        if (!clients || clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No clients found',
            });
        }

        res.status(200).json({
            success: true,
            data: clients,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};




// Api for update yearly transaction and client Data
const update_detail = async (req, res) => {
    try {
        let { clientId, booking_id, payment_status } = req.body
        // check for required fields
        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID Required'
            })
        }
        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID Required'
            })
        }
        if (!payment_status) {
            return res.status(400).json({
                success: false,
                message: 'payment_status Required'
            })
        }

        //check for client
        const client = await employeeModel.findById(clientId);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found',
            });
        }

        payment_status = parseInt(payment_status)
        let transaction
        if (payment_status === 1) {
            transaction = await package_transaction_model.findOne({ booking_id: booking_id })
            if (transaction) {

                    transaction.client_id = clientId,
                    transaction.client_name = client.name,
                    transaction.company = client.company_name,
                    transaction.package_id = client.package_id
                    transaction.package_name = client.package_name
                    transaction.payment_status = 'STATE_COMPLETED'

                await transaction.save()

                client.status = 1
                await client.save()

                const EmployeeContent = `
                                                                                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hello ${client.name},</p>
                                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Here are your account login details:</p>

                                            <table style="border-collapse: collapse; width: 50%; margin: auto; border: 1px solid #4CAF50; border-radius: 10px;">
                                                <tr>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">
                                                        <strong>Email:</strong>
                                                    </td>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">
                                                        ${client.email}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">
                                                        <strong>Password:</strong>
                                                    </td>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">
                                                        ${client.plain_pwd}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; background-color: #f1f1f1;">
                                                        <strong>Phone No:</strong>
                                                    </td>
                                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fafafa;">
                                                        ${client.phone_no}
                                                    </td>
                                                </tr>
                                            </table>
                                            `;

                // Send email to the staff
                await send_EmployeeEmail(client.email, `Your Account successfully Created`, EmployeeContent);


                // send notification to admin
                try {
                    const newNotification = adminNotificationModel.create({
                        title: `New Client`,
                        message: `New client added successfully`,
                        date: new Date(),
                        status: 1,
                    });
                    newNotification.save();
                } catch (notificationError) {
                    console.error('Error creating notification:', notificationError);
                }
            }

            else {

                return res.status(400).json({
                    success: false,
                    message: 'transaction Not Found'
                })
            }
         }
            
                else {
                    transaction = await package_transaction_model.findOne({ booking_id: booking_id })

                        transaction.client_id = clientId,
                        transaction.client_name = client.name,
                        transaction.company = client.company_name,
                        transaction.package_id = client.package_id
                        transaction.package_name = client.package_name
                        transaction.payment_status = 'STATE_FAILED' 

                        await transaction.save()
                }

     

        return res.status(200).json({  
            success: true,
            message: 'details updated'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}

// inactive client automatically
cron.schedule('* * * * *', async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Convert string package_end_date to Date object in the query
        let inactive_clients = await employeeModel.find({
            package_end_date: {
                $lt: currentDate.toISOString(),
            },
            status: { $ne: 2 },
        });

        if (inactive_clients.length > 0) {
            // Update status for all inactive clients
            await employeeModel.updateMany(
                {
                    _id: {
                        $in: inactive_clients.map((client) => client._id),
                    },
                },
                {
                    status: 0,
                }
            );

            // console.log('Inactive clients have been updated.');
        } else {
            // console.log('No active clients found.');
        }
    } catch (error) {
        console.error('Error while updating job status:', error);
    }
});


// Employee Login
const Emp_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is Required",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is Required",
            });
        }
        // Find Employee by email
        const emp = await employeeModel.findOne({ email: email });

        if (!emp) {
            return res.status(400).json({
                success: false,
                message: "Email incorrect"
            });
        }
        const status = emp.status
        if (status === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your account is Not Active yet. Please contact the admin for further details.'
            })
        }

        // check for package
        let package = await clientPackageModel.findOne({ _id: emp.package_id })
        if (!package) {
            return res.status(400).json({
                success: false,
                message: 'Package not found'
            })
        }

             
        let package_key = '';
        
           
        if (package.package_type === 'Weekly') {
            const weekNumber = parseInt(package.package_name.match(/\d+/), 10);
            package_key = `w${weekNumber}`;
        } else if (package.package_type === 'Yearly') {
            if (package.package_name === 'Starter Package') {
                package_key = 'y1';
            } else if (package.package_name === 'Professional Package') {
                package_key = 'y2';
            } else {
                package_key = 'y3';
            }
        }

        // Check if the stored password is in plain text
        if (emp.password && emp.password.startsWith("$2b$")) {
            // Password is already bcrypt hashed
            const passwordMatch = await bcrypt.compare(password, emp.password);

            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Password Incorrect"
                });
            }
        } else {
            // Convert plain text password to bcrypt hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the stored password in the database
            emp.password = hashedPassword;
            await emp.save();
        }
         

        return res.json({
            success: true,
            message: "Login Successfully ",
            data: {
                _id: emp._id,
                name: emp.name,
                email: emp.email,
                password: emp.password,
                phone_no: emp.phone_no,
                status: emp.status,
                profileImage: emp.profileImage,
                company_name: emp.company_name,
                Number_of_emp: emp.Number_of_emp,
                company_industry: emp.company_industry,
                company_HQ: emp.company_HQ,
                package_id: emp.package_id,
                package_name: package.package_name,
                package_type: package.package_type,
                package_features: package.features,
                package_price: package.price,
                package_price_with_gst: package.price_with_gst || '',
                package_duration: package.duration,
                job_active_days: package.valid_days,
                package_key: package_key,
                package_activate_date: emp.package_active_date || '',
                package_expiry_date: emp.package_end_date || ''

            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "server error",
        });
    }
};

// Api for get Employee Details
const getEmployeeDetails = async (req, res) => {
    try {
        const empId = req.params.empId
        // check for empId
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'empId required'
            })
        }

          
        // check for emp
        const emp = await employeeModel.findOne({ _id: empId })
        if (!emp) {
            return res.status(400).json({
                success: false,
                message: 'employee not found'
            })
        }
        
        return res.status(200).json({
            success: true,
            message: 'employee Details',
            Details: emp
        })

    } catch (error) {
        return res.status(500).json({
            success: 'server error',
            error_message: error.message
        })
    }
}

// Api for update Admin Panel
const updateEmp = async (req, res) => {
    try {
        const empId = req.params.empId
        const { name, email, phone_no } = req.body
        // check for empId 
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'empId required'
            })
        }


        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter valid Email'
            })
        }
        // check for existing emp

        const exist_emp = await employeeModel.findOne({ _id: empId })
        if (!exist_emp) {
            return res.status(400).json({
                success: false,
                message: 'Employee not found'
            })
        }

        // update profile Image of the exist_emp
        let profileImage = exist_emp.profileImage
        if (req.file && req.file.filename) {
            //     // Get the file extension
            //     const fileExtension = path.extname(req.file.filename).toLowerCase();

            //     // List of allowed extensions
            //     const allowedExtensions = ['.jpg', '.jpeg', '.png'];

            //     // Check if the file extension is in the allowed list
            //     if (allowedExtensions.includes(fileExtension)) {
            //         // If valid, update the profile image
            profileImage = req.file.filename;
            //     } else {
            //         // If not valid, throw an error
            //         return res.status(400).json({
            //             success : false ,
            //             message :  'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.'
            //     });
            //     }
        }


        exist_emp.name = name
        exist_emp.email = email
        exist_emp.phone_no = phone_no

        if (profileImage) {
            exist_emp.profileImage = profileImage
        }
        await exist_emp.save()

        return res.status(200).json({
            success: true,
            message: 'Employee Details updated successfully ',
            data: exist_emp
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message

        })
    }
}

// Api for changePassword
const emp_ChangePassword = async (req, res) => {
    try {
        const empId = req.params.empId
        const { oldPassword, password, confirmPassword } = req.body
        // check for empId

        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'Missing ClientId'
            })
        }
        // check for required fields
          if(!oldPassword)
          {
            return res.status(400).json({
                success: false,
                message: 'Missing Old Password'
            })
          }
          if(!password)
          {
            return res.status(400).json({
                success: false,
                message: 'Missing  Password'
            })
          }

          if(!confirmPassword)
          {
            return res.status(400).json({
                success: false,
                message: 'Missing confirmPassword'
            })
          }

        // check for employee
        const emp = await employeeModel.findOne({ _id: empId })

        if (!emp) {
            return res.status(400).json({
                success: false,
                message: 'Client Details not found'
            })
        }

        // check for confirm password 

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Confirm Password Incorrect'
            })
        }

        //  check for old password is matched with storedPassword
        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            emp.password
        );

        if (!isOldPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Old Password Incorrect '
            })
        }                  
                

        // encrypt the newPassword

        const hashedNewPassword = await bcrypt.hash(password, 10);
        // update the employee password with new encrypted password
        emp.password = hashedNewPassword;
        await emp.save();
        return res.status(200).json({
            success: true,
            message: "Password Changed Successfully",

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error_message: error.message
        })
    }
}

// Forget password of the client
// Api for forget password (Genrate OTP)


const forgetPassOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter valid Email'
            })
        }
        const client = await employeeModel.findOne({ email });

        if (!client) {
            return res.status(400).json({ success: false, message: 'client with given email not found' });
        }

        const otp = generateOTP();

        // Save the OTP in the otpModel
        const otpData = {
            clientId: client._id,
            otp: otp
        };
        console.log(otpData)
        await otpModel.create(otpData);

        const emailContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Forgot Password - Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div class="container" style="width: 80%; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                    <section style="margin-top: 20px;">
                        <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px;">Dear ${client.name} </h2>
                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 30px;">We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
                        <div class="otp-box" style="background-color: #f3fcfd; text-align: center; padding: 20px; border-radius: 10px; margin: 0 auto 30px; max-width: 200px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                            <div class="otp-code" style="font-size: 36px; font-weight: bold; color: #333;">${otp}</div>
                        </div>
                        <p class="message" style="color: #666; font-size: 14px; text-align: center; margin-bottom: 20px;">This OTP will expire in 2 minutes.</p>
                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">If you didn't request a password reset, you can ignore this email.</p>
                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">Thank you!</p>
                        <div class="footer" style="text-align: center; margin-top: 40px; color: #666; font-size: 14px;">&copy;  Smart Start Ltd. All rights reserved.</div>
                    </section>
                </div>
            </body>
            </html>
            `
        await sendEmails(client.email, "Password reset", emailContent);

        res.status(200).json({
            success: true,
            message: "An OTP has been sent to your ",
            email: client.email,
        });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ success: false, message: "server error", error_message: error.message });
    }

    function isValidEmail(email) {
        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function generateOTP() {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        return otp.slice(0, 4);
    }
};


// APi for verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body
        if (!otp) {
            return res.status(400).json({ success: false, message: 'OTP is Required' })
        }
        const userOTP = await otpModel.findOne({ otp })
        if (!userOTP) {
            return res.status(400).json({ success: false, message: ' Invalid OTP or expired' })
        }
        res.status(200).json({ success: true, message: 'OTP Verified Successfully', clientId: userOTP.clientId })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// APi for otp verify and reset password for forget password 

const clientResetPass = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const clientId = req.params.clientId
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }
        if (!confirmPassword) {
            return res.status(400).json({ success: false, message: 'Confirm Password is required' });
        }
        if (!clientId) {
            return res.status(400).json({ success: false, message: 'clientId is required' });
        }

        const client = await employeeModel.findById(clientId);

        if (!client) {
            return res.status(400).json({ success: false, message: 'Invalid clientId' });
        }

        // checlk if password and confirmpassword matched 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Confirm Password Not Matched'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        client.password = hashedPassword;
        await client.save();

        // Delete the used OTP
        await otpModel.deleteOne({ clientId });

        res.status(200).json({ success: true, message: 'Password Reset Successfully' });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ success: false, message: 'server error', error_message: error.message });
    }
};

/* job Category section */

// API for add job title in job title schema

const addJobTitle = async (req, res) => {
    const { jobTitle } = req.body;

    try {
        const requiredFields = ["jobTitle"];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        message: `Missing ${field.replace("_", " ")} field`,
                        success: false,
                    });
            }
        }

        // Check for jobTitle
        const existjobTitle = await jobTitleModel.findOne({ jobTitle });

        if (existjobTitle) {
            return res
                .status(400)
                .json({ message: "JobTitle already exist ", success: false });
        }

        const newjobTitle = new jobTitleModel({
            jobTitle: jobTitle,
        });
        const savedjobTitle = await newjobTitle.save();

        return res
            .status(200)
            .json({
                success: true,
                message: `JobTitle added successfully `,
                stop: savedjobTitle,
            });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: `server error`,
                error_message: error,
            });
    }
};

// get all jobTitle form the jobTitle Schema

const alljobTitle = async (req, res) => {
    try {
        // Fetch all jobTitles from the database
        const jobTitles = await jobTitleModel.find({});

        // Check if jobTitles array is empty
        if (jobTitles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No JobTitles found",
            });
        } else {
            // Map jobTitles to required format
            const formattedJobTitles = jobTitles.map(jobT => ({
                jobTitle: jobT.jobTitle,
                _id: jobT._id
            }));

            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All JobTitles",
                details: formattedJobTitles
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};


// Delete a particular jobTitle by jobtitle_id

const deletejobTitle = async (req, res) => {
    try {
        const jobtitle_id = req.params.jobtitle_id;

        // Check for route existence
        const existingjobTitle = await jobTitleModel.findOne({ _id: jobtitle_id });
        if (!existingjobTitle) {
            return res.status(400).json({ success: false, error: `JobTitle not found` });
        }

        // Delete the jobTitle from the database
        await existingjobTitle.deleteOne();

        res
            .status(200)
            .json({ success: true, message: "JobTitle deleted successfully" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "server error", error_message: error.message });
    }
};

/*  main Job title section  */

const add_Main_JobTitle = async (req, res) => {
    const { Main_jobTitle } = req.body;

    try {
        // Validate required field
        if (!Main_jobTitle) {
            return res.status(400).json({
                success: false,
                message: "Missing Main job title field",
            });
        }

        // Check for existing Main_jobTitle (case-insensitive)
        const existMainJobTitle = await main_jobTitleModel.findOne({
            Main_jobTitle: { $regex: `^${Main_jobTitle}$`, $options: 'i' },
        });

        if (existMainJobTitle) {
            return res.status(400).json({
                success: false,
                message: "Main job title already exists",
            });
        }

        // Create and save new Main job title
        const newMainJobTitle = new main_jobTitleModel({ Main_jobTitle });
        await newMainJobTitle.save();

        return res.status(200).json({
            success: true,
            message: "Main job title added successfully",
        });
    } catch (error) {
        console.error("Error in add_Main_JobTitle:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error_message: error.message,
        });
    }
};

// Api for get all main job titles
const all_main_jobTitle = async (req, res) => {
    try {
        // Fetch all jobTitles from the database
        const jobTitles = await main_jobTitleModel.find({});

        // Check if jobTitles array is empty
        if (jobTitles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No JobTitles found",
            });
        } else {
            // Map jobTitles to required format
            const formattedJobTitles = jobTitles.map(jobT => ({
                Main_jobTitle: jobT.Main_jobTitle,
                _id: jobT._id
            }));

            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All Main JobTitles",
                details: formattedJobTitles
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};

const all_main_jobTitle_main = async (req, res) => {
    try {
        // Fetch all jobTitles from the database
        const jobTitles = await main_jobTitleModel.find({});

        // Check if jobTitles array is empty
        if (jobTitles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No JobTitles found",
            });
        } else {
            // Map jobTitles to required format
            const formattedJobTitles = jobTitles.map(jobT => ({
                Main_jobTitle: jobT.Main_jobTitle,
                _id: jobT._id
            }));

            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All Main JobTitles",
                details: formattedJobTitles
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};

// Api for delete main job Title
const delete_main_jobTitle = async (req, res) => {
    try {
        const main_jobtitle_id = req.params.main_jobtitle_id;

        // Check for route existence
        const existingjobTitle = await main_jobTitleModel.findOne({ _id: main_jobtitle_id });
        if (!existingjobTitle) {
            return res.status(400).json({ success: false, error: `main_jobtitle not found` });
        }

        // Delete the jobTitle from the database
        await existingjobTitle.deleteOne();

        res
            .status(200)
            .json({ success: true, message: "jobtitle deleted successfully" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "server error", error_message: error.message });
    }
};


/* job Description Section  */
// Api for add job Description

const addJob_Description = async (req, res) => {


    try {
        const { jobTitle, job_Description, Responsibilities } = req.body;

        // check for existing job description
        const existJd = await jobDescription_model.findOne({
            jobTitle: jobTitle
        })

        if (existJd) {
            existJd.jobTitle = jobTitle
            existJd.job_Description = job_Description
            existJd.Responsibilities = Responsibilities

            await existJd.save()
            return res.status(200).json({
                success: true,
                message: 'job Description update successfully'
            })
        } else {
            const requiredFields = ["jobTitle", "job_Description", "Responsibilities"];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res
                        .status(400)
                        .json({
                            message: `Missing ${field.replace("_", " ")} field`,
                            success: false,
                        });
                }
            }
            // create new JD
            const newJD = new jobDescription_model({
                jobTitle: jobTitle,
                job_Description: job_Description,
                Responsibilities: Responsibilities,
            });
            const savedjob_Description = await newJD.save();

            return res
                .status(200)
                .json({
                    success: true,
                    message: `job Description added successfully `,
                    job_Description: savedjob_Description,
                });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: `server error`,
                error_message: error,
            });
    }
};


// get all jobDescription form the job description Schema

const alljobDescription = async (req, res) => {
    try {
        // Fetch all jDs from the database
        const jds = await jobDescription_model.find({});

        // Check if jobTitles array is empty
        if (jds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Job Descriptions found",
            });
        } else {
            // Map formattedjds to required format
            const formattedjds = jds.map(jobT => ({
                jobTitle: jobT.jobTitle,
                job_Description: jobT.job_Description,
                Responsibilities: jobT.Responsibilities,
                jd_download_count: jobT.jd_download_count,
                _id: jobT._id
            }));

            // Send formatted jobTitles as response
            res.status(200).json({
                success: true,
                message: "All Description",
                details: formattedjds
            });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ success: false, message: "Server error", error_message: error.message });
    }
};

// Api for get particular JD using title 

const getJd = async (req, res) => {
    try {
        const { jobTitle } = req.body
        // check for job Title
        if (!jobTitle) {
            return res.status(400).json({
                success: false,
                message: 'job Title Required'
            })
        }
                    
        // check for job Descreption for jobTItle
        const JD = await jobDescription_model.findOne({
            jobTitle: jobTitle
        })

        if (!JD) {
            return res.status(400).json({
                success: false,
                message: `Job Description not found for the given jobTitle : ${jobTitle}`
            })
        }

        return res.status(200).json({
            success: true,
            message: 'JOB Description',
            Details: JD
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// Delete a particular job Description by jD Id

const deleteJob_Description = async (req, res) => {
    try {
        const Jd_id = req.params.Jd_id;

        // Check for JD existence
        const existingjD = await jobDescription_model.findOne({ _id: Jd_id });
        if (!existingjD) {
            return res.status(400).json({ success: false, error: `Job Description not found` });
        }

        // Delete the job Description from the database
        await existingjD.deleteOne();

        res
            .status(200)
            .json({ success: true, message: "job Description deleted successfully" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "server error", error_message: error.message });
    }
};

/* Job Section */
// Api for post job
const postJob = async (req, res) => {
    try {
        const empId = req.params.empId;
        console.log(empId)
        var {
            job_title,
            //  sub_job_title ,
            job_Description,
            qualification,
            job_Responsibility,
            job_type,
            job_schedule,
            Minimum_pay,
            Maximum_pay,
            Rate,
            Number_of_emp_needed,
            // requirement_timeline,
            startDate,
            endDate,
            skills,
            Experience,
            company_address,
            template_type,
            location,
            hr_email,
            hiring_manager_email,
            acadmic_qualification
            // isPsychometricTest,
            // psychometric_Test

        } = req.body;
console.log(req.body)
            // skills = JSON.parse(skills),
            // acadmic_qualification = JSON.parse(acadmic_qualification)
           
            // if (!isValidEmail(hiring_manager_email)) {
            //     return res.status(400).json({
            //         success : false ,
            //         message : 'Enter valid Email for Hiring Manager'
            //     })
            // }   
            // if (!isValidEmail(hr_email)) {
            //     return res.status(400).json({
            //         success : false ,
            //         message : 'Enter valid Email for HR'
            //     })
            // }   
      
               

        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'Employee Id required'
            });
        }

        const employee = await employeeModel.findOne({ _id: empId, status: 1 });
        if (!employee) {
            return res.status(400).json({
                success: false,
                message: 'Client details not found or account is suspended'
            });
        }
           
        // Determine job post limit based on the package
        const packageJobLimits = {
            'Starter Package': 5,
            'Professional Package': 15,
            'Enterprise Package': 30,
        };

        let jobCountPerPackage = packageJobLimits[employee.package_name] || 1;

        // Find jobs posted by the employee within the package period
        const jobs = await jobModel.find({
            emp_Id: empId,
            createdAt: {
                $gte: employee.package_active_date,
                $lte: employee.package_end_date,
            },
        });
        

        if (jobs.length >= jobCountPerPackage) {
            return res.status(400).json({
                success: false,
                message: `client's job post limit is exceeded.`,
            });
        }
        
        // Check for academic qualification post limit as per employee package
        // const packageLimits = {
        //     'Starter Package': 1,
        //     'Professional Package': 2,
        //     'Enterprise Package': 5,
        // };

        // let acadmicLimit = acadmic_qualification.length;
        // console.log(acadmicLimit)
        // let maxAllowed = packageLimits[employee.package_name];

        // if (acadmicLimit > maxAllowed) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Only ${maxAllowed} academic qualifications allowed to apply post for the : ${employee.package_name}`
        //     });
        // }



        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

          
        // Check if the jobTitle exists in the jobTitleMOdel
        const existingjobTitle = await main_jobTitleModel.findOne({ Main_jobTitle: job_title });

        if (!existingjobTitle) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: `job_title '${job_title}' does not exist in job_title Database`,
                });
        }

        const existJob = await jobModel.findOne({
            job_title,
            company_name: employee.company_name,
            startDate: { $lte: formattedStartDate },
            endDate: { $gte: formattedEndDate }
        });

           
        if (existJob) {
            return res.status(400).json({
                success: false,
                message: 'Similar job already exists within the specified time period'
            });
        }
        
        // Generate a random job
        function generateRandomNumber(length) {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const randomNumber = generateRandomNumber(5);
        const finalString = `JOB${randomNumber}`;
        let job_image = ''
        if (req.file) {
            job_image = req.file.filename
        }
          
            
        const newJob = new jobModel({
            emp_Id: empId,
            jobId: finalString,
            job_title,
            // sub_job_title,
            job_Description,
            qualification,
            job_Responsibility: job_Responsibility || null,
            job_type,
            job_schedule,
            salary_pay: [{ Minimum_pay, Maximum_pay, Rate }],
            Number_of_emp_needed,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            // key_qualification: skills,
            skills,
            acadmic_qualification,
            Experience,
            company_address :company_address || "",
            template_type,
            company_name: employee.company_name,
            employee_email: employee.email,
            phone_no: employee.phone_no,
            company_Industry: employee.company_industry,
            status: 1,
            location,
            // isPsychometricTest  ,
            // psychometric_Test : psychometric_Test || '',
            job_image: job_image || '',
            hiring_manager_email : hiring_manager_email || null,
            hr_email : hr_email || null
        });



        await newJob.save();
        try {
            const newNotification = new empNotificationModel({
                empId: empId,
                message: `your Job ${job_title} post successfully`,
                date: new Date(),
                status: 1,
            });
            await newNotification.save();
        } catch (notificationError) {
            console.error('Error creating notification:', notificationError);
        }

        // // send notification to admin
        // try {
        //     const adminNotification = new adminNotificationModel({
        //         title: `New Job`,
        //         message: `${employee.name} from ${employee.company_name} has posted a new job.`,
        //         date: new Date(),
        //         status: 1,
        //     });
        //     await adminNotification.save();
        // } catch (notificationError) {
        //     console.error('Error creating notification:', notificationError);
        // }


        return res.status(200).json({
            success: true,
            message: 'Job posted successfully',
            jobId: newJob.jobId,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get jobs posted by employee

const getJobs_posted_by_employee = async (req, res) => {
    try {
        const empId = req.params.empId;
        const { status } = req.query;

        // Check for empId
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'Employer ID required',
            });
        }

        // Build the query object
        const query = { emp_Id: empId };

        // Add status filter if provided
        if (status) {
            if (status === '1' || status === '3') {
                query.status = status;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value. Use 1 for active and 3 for inactive',
                });
            }
        }

        // Check for employee jobs based on the query
        const emp_jobs = await jobModel.find(query);

        if (!emp_jobs || emp_jobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found',
            });
        }

        // Map job data and get male and female candidate count for each job
        const jobsData = await Promise.all(emp_jobs.map(async (job) => {
            // Get female candidate count
            const femaleCount = await appliedjobModel.countDocuments({
                jobId: job.jobId,
                gender: 'Female'
            });

            // Get male candidate count
            const maleCount = await appliedjobModel.countDocuments({
                jobId: job.jobId,
                gender: 'Male'
            });

            const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;

            return {
                jobId: job.jobId,
                job_title: job.job_title,
                //   sub_job_title : job.sub_job_title,
                company_name: job.company_name,
                Number_of_emp_needed: job.Number_of_emp_needed,
                job_type: job.job_type,
                job_schedule: job.job_schedule,
                salary_pay: salary_pay,
                job_Description: job.job_Description,
                job_Responsibility: job.job_Responsibility || null,
                company_address: job.company_address,
                employee_email: job.employee_email,
                requirement_timeline: job.requirement_timeline,
                startDate: job.startDate,
                endDate: job.endDate,
                phone_no: job.phone_no,
                skills: job.skills,
                qualification : job.qualification,
                acadmic_qualification: job.acadmic_qualification,
                Experience: job.Experience,
                template_type: job.template_type,
                company_Industry: job.company_Industry,
                job_photo: job.job_photo,
                status: job.status,
                isPsychometricTest: job.isPsychometricTest,
                psychometric_Test: job.psychometric_Test,
                job_image: job.job_image,
                location: job.location,
                hr_email: job.hr_email,
                hiring_manager_email: job.hiring_manager_email,

                // Add male and female candidate counts
                candidateCounts: {
                    Male: maleCount,
                    Female: femaleCount
                }
            };
        }));

        return res.status(200).json({
            success: true,
            message: 'All Jobs',
            JobsCount: emp_jobs.length,
            emp_jobs: jobsData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
}
// Api for update the Job for the client

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.jobId
        const { Number_of_emp_needed, 
            // job_type, 
            // job_schedule,
            job_Description, 
            // job_Responsibility, 
            startDate, 
            endDate, 
            Experience,
            skills,
            qualification
        } = req.body



        // check for job Id required
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job id required'
            })
        }

        // check for job
        const job = await jobModel.findOne({
            jobId: jobId
        })

        // update the details of the Job

        job.Number_of_emp_needed = Number_of_emp_needed
        // job.job_type = job_type
        // job.job_schedule = job_schedule
        job.job_Description = job_Description
        // job.job_Responsibility = job_Responsibility
        job.startDate = startDate
        job.endDate = endDate
        job.Experience = Experience
        job.skills = skills
        job.qualification  = qualification

        await job.save()
        return res.status(200).json({
            success: true,
            message: 'Job details updated successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}
// Api for get active jobs by client

const activejobs_by_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        // Check for client ID
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client ID required'
            });
        }

        // Check for client
        const client = await employeeModel.findOne({ _id: client_id });
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }
        const company_HQ = client.company_HQ;

        // Check for active jobs
        const activeJobs = await jobModel.find({ emp_Id: client_id, status: 1 });

        if (activeJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No active jobs found'
            });
        }

        // Iterate over active jobs to get candidate details
        const activeJobsWithCandidates = await Promise.all(activeJobs.map(async (job) => {
            const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
            const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
            const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;
            const AllCandidateCount = candidateDetails.length;
            const jobExperienceValue = parseInt(job.Experience.match(/\d+/)[0]);

            // Count matched and mismatched candidate profiles based on job experience
            const matchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience >= jobExperienceValue).length
            const mismatchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience < jobExperienceValue).length

            return {
                ...job.toObject(),
                maleCandidateCount,
                femaleCandidateCount,
                AllCandidateCount,
                matchedProfileCount,
                mismatchedProfileCount,
                company_HQ
            };
        }));

        // Sort active jobs by createdAt date
        const sortedJobs = activeJobsWithCandidates.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({
            success: true,
            message: 'Active jobs',
            activeJob: sortedJobs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};




// APi for get inactive jobs by client
const Inactivejobs_by_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        // Check for client ID
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client ID required'
            });
        }

        // Check for Inactive jobs
        const InactiveJob = await jobModel.find({
            emp_Id: client_id,
            status: { $in: [0, 3] }
        });

        if (InactiveJob.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No Inactive jobs found'
            });
        }

        // Check for client
        const client = await employeeModel.findOne({ _id: client_id });
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }
        const company_HQ = client.company_HQ;


        // Iterate over Inactive jobs to get candidate details
        const InactiveJobsWithCandidates = await Promise.all(InactiveJob.map(async (job) => {
            const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
            const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
            const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;
            const AllCandidateCount = candidateDetails.length;
            // Extract numerical value from job.Experience string using regular expression
            const jobExperienceValue = parseInt(job.Experience.match(/\d+/)[0]);

            // Count matched and mismatched candidate profiles based on job experience
            const matchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience >= jobExperienceValue).length;
            const mismatchedProfileCount = candidateDetails.filter(candidate => candidate.job_experience < jobExperienceValue).length;


            return {
                ...job.toObject(),
                maleCandidateCount,
                femaleCandidateCount,
                AllCandidateCount,
                matchedProfileCount,
                mismatchedProfileCount,
                company_HQ
            };
        }));

        // Sort Inactive jobs by createdAt date
        const sortedJobs = InactiveJobsWithCandidates.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({
            success: true,
            message: 'Inactive jobs',
            inactiveJob: sortedJobs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for get Female jobseeker profile for the job

const get_Female_jobseeker_profile = async (req, res) => {
    try {
        const jobId = req.params.jobId
        const { jobSeeker_status } = req.query

        // check for jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId Required'
            })
        }

        // check for job
        const job = await jobModel.findOne({ jobId: jobId })
        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'job not found'
            })
        }
        const filter = {}

        if (jobSeeker_status) {
            filter.jobSeeker_status = jobSeeker_status;
        }
        // check for Female job seeker profile for the job

        const Female_jobseeker = await appliedjobModel.find({
            gender: 'Female',
            jobId: jobId,
            ...filter
        })
        if (!Female_jobseeker) {
            return res.status(400).json({
                success: false,
                message: 'no Female candidate have applied for these job '
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Female candidate Profile',
            Female_jobseekerCount: Female_jobseeker.length,
            Details: Female_jobseeker.map((candidate) => ({
                _id: candidate._id,
                jobId: candidate.jobId,
                first_Name: candidate.first_Name,
                last_Name: candidate.last_Name,
                user_Email: candidate.user_Email,
                city: candidate.city,
                state: candidate.state,
                phone_no: candidate.phone_no,
                gender: candidate.gender,
                resume: candidate.uploadResume,
                Highest_Education: candidate.Highest_Education,
                relevant_Experience: candidate.job_experience,
                Total_experience: candidate.Total_experience,
                jobSeeker_status: candidate.jobSeeker_status,
                candidateStatus: candidate.candidateStatus,
                saved_status: candidate.saved_status,
                candidate_rating: candidate.candidate_rating


            }))
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// Get All job seeker profile 
const get_jobseeker_profile = async (req, res) => {
    try {
        const jobId = req.params.jobId
        const { jobSeeker_status } = req.query

        // check for jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId Required'
            })
        }

        // check for job
        const job = await jobModel.findOne({ jobId: jobId })
        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'job not found'
            })
        }
        const filter = {}

        if (jobSeeker_status) {
            filter.jobSeeker_status = jobSeeker_status;
        }

        // check for Other job seeker profile for the job

        const Other_jobseeker = await appliedjobModel.find({
            jobId: jobId,
            gender: { $ne: 'Female' },
            ...filter

        })
        if (!Other_jobseeker) {
            return res.status(400).json({
                success: false,
                message: 'no Other candidate have applied for these job '
            })
        }

        return res.status(200).json({
            success: true,
            message: 'candidate Profiles',
            Other_jobseekerCount: Other_jobseeker.length,
            Details: Other_jobseeker.map((candidate) => ({

                _id: candidate._id,
                jobId: candidate.jobId,
                first_Name: candidate.first_Name,
                last_Name: candidate.last_Name,
                user_Email: candidate.user_Email,
                city: candidate.city,
                state: candidate.state,
                phone_no: candidate.phone_no,
                gender: candidate.gender,
                resume: candidate.uploadResume,
                Highest_Education: candidate.Highest_Education,
                relevant_Experience: candidate.job_experience,
                Total_experience: candidate.Total_experience,
                jobSeeker_status: candidate.jobSeeker_status,
                candidateStatus: candidate.candidateStatus,
                saved_status: candidate.saved_status,
                candidate_rating: candidate.candidate_rating



            }))
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// APi for Delete particular job
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if jobId is provided
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job Id is required'
            });
        }

        // Find the job
        const job = await jobModel.findOne({ jobId: jobId });

        // If job not found
        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'Job not found'
            });
        }

        // // Check applied candidates for this job
        // const appliedCandidates = await appliedjobModel.find({ jobId: jobId });

        // if (appliedCandidates.length > 0) {
        //     // Delete all applied candidates for this job
        //     await appliedjobModel.deleteMany({ jobId: jobId });
         
        // }

        // Delete the job
        await job.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error_message: error.message
        });
    }
};


// Api for delete particular candidate/ jobseeker for the job'
const deleteCandidate = async (req, res) => {
    try {
        const candidateId = req.params.candidateId
        // check for candidateId
        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID required'
            })
        }

        // check for candidate details
        const check_candidate = await appliedjobModel.findOne({
            _id: candidateId
        })
        if (!check_candidate) {
            return res.status(400).json({
                success: false,
                message: 'candidate Details not found'
            })
        }

        await check_candidate.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'candidate Profile Deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}

// Api to export candidate with there jobseeker_status

const export_candidate = async (req, res) => {
    try {
        const { jobSeeker_status , jobId } = req.query;
        const {  gender } = req.params;

        // Define status labels
        const statusLabels = {
            2: 'Shortlisted',
            3: 'longlisted',
            4: 'Assessment_Scheduled',
            5: 'Schedule_Interview'
        };

           if(!jobId)
            {
                  return res.status(400).json({
                       success : false ,
                       message : 'JOB Id Required'
                  })
            } 

        // Check for job seeker status
        if (!jobSeeker_status || !statusLabels[jobSeeker_status]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing job seeker status value'
            });
        }

        // Check for gender
        if (!gender) {
            return res.status(400).json({
                success: false,
                message: 'Missing gender'
            });
        }

        // Fetch candidates based on gender
        const candidates = await appliedjobModel.find({ gender ,  jobId : jobId  });

        // Filter candidates by job seeker status
        const filteredCandidates = candidates.filter(candidate => candidate.jobSeeker_status == jobSeeker_status);

        // Create Excel workbook and worksheet
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet("candidates");

        // Define the Excel Header
        worksheet.columns = [
            {
                header: "First Name",
                key: "first_Name",
            },

            {
                header: "Last Name",
                key: "last_Name",
            },

            {
                header: "User Email",
                key: "user_Email",
            },

            {
                header: "City",
                key: "city",
            },
            {
                header: "Phone Number",
                key: "phone_no",
            },
            {
                header: "Status",
                key: "jobSeeker_status",
            },
            {
                header: "Gender",
                key: "gender",
            },
            {
                header: "Job Heading",
                key: "job_Heading",
            },
            {
                header: "Job Id",
                key: "jobId",
            },
            {
                header: "Highest Education",
                key: "Highest_Education",
            },
            {
                header: "Total Experience",
                key: "Total_experience",
            },
            {
                header: "Resume",
                key: "uploadResume",
            },
        ];

        // Add filtered candidates data to the worksheet
        
        filteredCandidates.forEach((candidate) => {
            worksheet.addRow({
                first_Name: candidate.first_Name,
                last_Name: candidate.last_Name,
                user_Email: candidate.user_Email,
                city: candidate.city,
                phone_no: candidate.phone_no,
                jobSeeker_status: statusLabels[jobSeeker_status],
                gender: candidate.gender,
                job_Heading: candidate.job_Heading,
                jobId: candidate.jobId,
                Highest_Education: candidate.Highest_Education,
                Total_experience: candidate.Total_experience,
                uploadResume: candidate.uploadResume,
            });
        });

        // Set response headers for downloading the Excel file
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader("Content-Disposition", `attachment; filename=${gender}_${statusLabels[jobSeeker_status]}_candidates.xlsx`);

        // Generate and send the Excel File as a response
        await workbook.xlsx.write(res);

        // End the response
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server error" });
    }
};



                                                               /*Job  sections */

// Api for get all Jobs

const getAll_Jobs = async (req, res) => {
    try {
        // Extract job status filter from query
        const job_status = req.query.job_status;
        const filter = {};

        if (job_status) {
            filter.status = job_status;
        }

        // Fetch jobs based on filter
        const allJobs = await jobModel.find({ ...filter }).sort({ createdAt: -1 }); 

        if (allJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found',
            });
        }
      
        // Prepare job title counts and map data
        const jobTitle_Count = new Map();

        const jobsData = await Promise.all(
            allJobs.map(async (job) => {

                // Salary pay formatting
                const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;

                // Normalize job title for counting
                const normalized_title = job.job_title.trim().toLowerCase();
                jobTitle_Count.set(normalized_title, (jobTitle_Count.get(normalized_title) || 0) + 1);

                // Fetch applied candidates for this job
                const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
                const loc_lat_long = await sl_loc_model.findOne({ loc: job.location })

                // Count male and female candidates
                const maleCandidateCount = candidateDetails.filter((candidate) => candidate.gender === 'Male').length;
                const femaleCandidateCount = candidateDetails.filter((candidate) => candidate.gender === 'Female').length;

                // Return job data 
                return {
                    jobId: job.jobId,
                    job_title: job.job_title,
                    //    sub_job_title : job.sub_job_title ,
                    company_name: job.company_name,
                    Number_of_emp_needed: job.Number_of_emp_needed,
                    job_type: job.job_type,
                    job_schedule: job.job_schedule, 
                    salary_pay,
                    job_Description: job.job_Description,
                    job_Responsibility: job.job_Responsibility || null,
                    company_address: job.company_address,
                    employee_email: job.employee_email,
                    requirement_timeline: job.requirement_timeline,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    phone_no: job.phone_no,
                    skills: job.skills,
                    qualification : job.qualification,
                    acadmic_qualification: job.acadmic_qualification,
                    Experience: job.Experience,
                    template_type: job.template_type,
                    company_Industry: job.company_Industry,
                    job_photo: job.job_photo,
                    status: job.status,
                    empId: job.emp_Id,
                    isPsychometricTest: job.isPsychometricTest,
                    psychometric_Test: job.psychometric_Test,
                    maleCandidateCount,
                    femaleCandidateCount,
                    fav_status: job.fav_status,
                    job_image: job.job_image || '',
                    location: job.location,
                    hiring_manager_email: job.hiring_manager_email,
                    hr_email: job.hr_email,
                    job_location_latitude: loc_lat_long ? loc_lat_long.lat : null,
                    job_location_longitude: loc_lat_long ? loc_lat_long.long : null,
                };
            })
        );

        // Convert job title counts to array
        const job_title_array = Array.from(jobTitle_Count.entries()).map(([title, count]) => ({
            title,
            count,
        }));

        // Return successful response
        return res.status(200).json({
            success: true,
            message: 'All Jobs',
            JobsCount: allJobs.length,
            //    job_title_array,
            allJobs: jobsData,
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


const getAll_Jobs_admin = async (req, res) => {
    try {
        // Extract job status filter from query
        const job_status = req.query.job_status;
        const filter = {};

        if (job_status) {
            filter.status = job_status;
        }

        // Fetch jobs based on filter
        const allJobs = await jobModel.find({ ...filter }).sort({ createdAt: -1 }); 
        // console.log(allJobs[0])
        if (allJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found',
            });
        }
      
        // Prepare job title counts and map data
        const jobTitle_Count = new Map();

        const jobsData = await Promise.all(
            allJobs.map(async (job) => {
                // Salary pay formatting
                const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;

                // Normalize job title for counting
                const normalized_title = job.job_title.trim().toLowerCase();
                jobTitle_Count.set(normalized_title, (jobTitle_Count.get(normalized_title) || 0) + 1);

                // Fetch applied candidates for this job
                const candidateDetails = await appliedjobModel.find({ jobId: job.jobId });
                const loc_lat_long = await sl_loc_model.findOne({ loc: job.location })

                // Count male and female candidates
                const maleCandidateCount = candidateDetails.filter((candidate) => candidate.gender === 'Male').length;
                const femaleCandidateCount = candidateDetails.filter((candidate) => candidate.gender === 'Female').length;

                // Return job data 
                return {
                    jobId: job.jobId,
                    job_title: job.job_title,
                    //    sub_job_title : job.sub_job_title ,
                    company_name: job.company_name,
                    Number_of_emp_needed: job.Number_of_emp_needed,
                    job_type: job.job_type,
                    job_schedule: job.job_schedule, 
                    salary_pay,
                    job_Description: job.job_Description,
                    job_Responsibility: job.job_Responsibility || null,
                    company_address: job.company_address,
                    employee_email: job.employee_email,
                    requirement_timeline: job.requirement_timeline,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    phone_no: job.phone_no,
                    skills: job.skills,
                    qualification : job.qualification,
                    acadmic_qualification: job.acadmic_qualification,
                    Experience: job.Experience,
                    template_type: job.template_type,
                    company_Industry: job.company_Industry,
                    job_photo: job.job_photo,
                    status: job.status,
                    empId: job.emp_Id,
                    isPsychometricTest: job.isPsychometricTest,
                    psychometric_Test: job.psychometric_Test,
                    maleCandidateCount,
                    femaleCandidateCount,
                    fav_status: job.fav_status,
                    job_image: job.job_image || '',
                    location: job.location,
                    hiring_manager_email: job.hiring_manager_email,
                    hr_email: job.hr_email,
                    job_location_latitude: loc_lat_long ? loc_lat_long.lat : null,
                    job_location_longitude: loc_lat_long ? loc_lat_long.long : null,
                };
            })
        );

        // console.log(jobsData)

        // Convert job title counts to array
        const job_title_array = Array.from(jobTitle_Count.entries()).map(([title, count]) => ({
            title,
            count,
        }));

        // Return successful response
        return res.status(200).json({
            success: true,
            message: 'All Jobs',
            JobsCount: allJobs.length,
            //    job_title_array,
            allJobs: jobsData,
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


// All active job count with there title

const all_active_jobs_Count_with_title = async (req, res) => {
    try {

        // Fetch all jobs
        const allJobs = await jobModel.find({ status: 1 });

        // If no jobs found, return error response
        if (allJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found'
            });
        }
        // Map job data to desired fromat and count
        const jobTitle_Count = new Map()
        // Map job data to desired format
        const jobsData = await Promise.all(allJobs.map(async (job) => {
            // Calculate salary range string
            const salary_pay = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;

            // Check if job has expired
            const today = new Date();
            const endDate = new Date(job.endDate);

            // Normalize job title for counting
            const normalized_title = job.job_title.trim().toLowerCase()
            jobTitle_Count.set(normalized_title, (jobTitle_Count.get(normalized_title) || 0) + 1)
            // Find candidate details for the job
            const candidateDetails = await appliedjobModel.find({
                jobId: job.jobId
            });

            // Count male and female candidates
            const maleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Male').length;
            const femaleCandidateCount = candidateDetails.filter(candidate => candidate.gender === 'Female').length;

            // Return formatted job data with candidate counts
            return {
                jobId: job.jobId,
                job_title: job.job_title,
                //    sub_job_title : job.sub_job_title ,
                company_name: job.company_name,
                Number_of_emp_needed: job.Number_of_emp_needed,
                job_type: job.job_type,
                job_schedule: job.job_schedule,
                salary_pay: salary_pay,
                job_Description: job.job_Description,
                job_Responsibility: job.job_Responsibility || null,
                company_address: job.company_address,
                employee_email: job.employee_email,
                requirement_timeline: job.requirement_timeline,
                startDate: job.startDate,
                endDate: job.endDate,
                phone_no: job.phone_no,
                skills: job.skills,
                qualification : job.qualification,
                acadmic_qualification: job.acadmic_qualification,
                Experience: job.Experience,
                template_type: job.template_type,
                company_Industry: job.company_Industry,
                job_photo: job.job_photo,
                status: job.status,
                empId: job.emp_Id,
                isPsychometricTest: job.isPsychometricTest,
                psychometric_Test: job.psychometric_Test,
                maleCandidateCount: maleCandidateCount,
                femaleCandidateCount: femaleCandidateCount,
                fav_status: job.fav_status,
                job_image: job.job_image || '',
                hiring_manager_email: job.hiring_manager_email,
                hr_email: job.hr_email
            };
        }));

        const sortedjobsData = jobsData.sort((a, b) => b.createdAt - a.createdAt)

        // convert job title count to an Array of objects

        const job_title_array = Array.from(jobTitle_Count.entries()).map(([title, count]) => {
            const jobMatch = allJobs.find(job => job.job_title.trim().toLowerCase() === title);
            return {
                jobId: jobMatch?.jobId,
                title,
                count
            };
        });
        
        
        // Return successful response with jobs data
        return res.status(200).json({
            success: true,
            message: 'All Jobs Count ',
            JobsCount: allJobs.length,
            jobTitleCounts: job_title_array
        });
    } catch (error) {
        // Return error response if any error occurs
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}


// Api for get particular job by jobId

const getJob = async (req, res) => {
    try {
        const jobId = req.params.jobId
        // check for jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId required'
            })
        }

        // check for job 

        const job = await jobModel.findOne({
            jobId: jobId
        })
        if (!job) {
            return res.status(400).json({
                success: false,
                message: 'job not found'
            })
        }
        

        // const loc_lat_long = await sl_loc_model.findOne({ loc: job.location })

        return res.status(200).json({
            success: true,
            message: 'job Details',
            Details: {
                _id : job._id,
                jobId : job.jobId,
                job_title : job.job_title,
                company_name : job.company_name,
                emp_Id : job.emp_Id,
                Number_of_emp_needed : job.Number_of_emp_needed,
                job_type : job.job_type,
                job_schedule : job.job_schedule,
                salary_pay : job.salary_pay,
                job_Description : job.job_Description,
                job_Responsibility : job.job_Responsibility,
                company_address : job.company_address,
                employee_email : job.employee_email,
                startDate : job.startDate,
                endDate : job.endDate,
                phone_no : job.phone_no,
                skills : job.skills,
                qualification : job.qualification,
                acadmic_qualification : job.acadmic_qualification,
                Experience : job.Experience,
                template_type : job.template_type,
                company_Industry : job.company_Industry,
                location : job.location,
                status : job.status,
                fav_status : job.fav_status,
                job_image : job.job_image,
                hr_email : job.hr_email,
                hiring_manager_email : job.hiring_manager_email,
                createdAt : job.createdAt,
                updatedAt : job.updatedAt,
            //     job_location_latitude : loc_lat_long.lat,
            //     job_location_longitude : loc_lat_long.long
             }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}




cron.schedule('* * * * *', async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Find jobs with endDate less than the current date

        const expiredJob = await jobModel.find({
            endDate: {
                $lt: currentDate,
            },
            status: { $ne: 3 },
        });

        if (expiredJob.length > 0) {
            await jobModel.updateMany(
                {
                    jobId: {
                        $in: expiredJob.map((job) => job.jobId),
                    },
                },
                {
                    status: 3,
                }
            );
        }
    } catch (error) {
        console.error('Error while updating job status:', error);
    }
});



// Api for search Job


const searchJob = async (req, res) => {
    try {
        const { job_title = '', location } = req.body;
        const { latest_Update, job_type, Experience, company_Industry, job_schedule } = req.query;

        // Return error if neither job_title nor location is provided
        if (!job_title && !location) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least job_title or location.'
            });
        }

        const filter = {};

        if (latest_Update) {
            filter.updatedAt = {
                $gte: new Date(latest_Update),
            };
        }

        if (job_type) {
            filter.job_type = job_type;
        }

        if (job_schedule) {
            filter.job_schedule = job_schedule;
        }

        if (Experience) {
            filter.Experience = { $regex: Experience, $options: 'i' };
        }

        if (company_Industry) {
            filter.company_Industry = company_Industry;
        }

        // Main query
        const query = {
            status: 1,
            ...filter
        };

        // Conditionally add job_title or location to the query
        if (job_title) {
            query.job_title = { $regex: job_title, $options: 'i' };
        }

        if (location) {
            query.location = { $in: [location] };
        }

        const jobs = await jobModel.find(query);

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jobs found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job Details',
            JobsCount: jobs.length,
            Details: jobs
        });

    } catch (error) {
        console.error("Search Job Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for filter job
const filterJob = async (req, res) => {
    try {
        const { job_title, company_address } = req.body;
        const { job_type, Experience, company_Industry, job_schedule } = req.query;

        // Initialize filter with status
        const filter = { status: 1 };

        if (job_type) filter.job_type = job_type;
        if (job_schedule) filter.job_schedule = job_schedule;
        if (Experience) filter.Experience = { $regex: Experience, $options: 'i' };
        if (company_Industry) filter.company_Industry = company_Industry;
        if (job_title) filter.job_title = { $regex: job_title.trim(), $options: 'i' };
        if (company_address) filter.company_address = { $regex: company_address.trim(), $options: 'i' };

        // console.log("Final Filter Query:", JSON.stringify(filter, null, 2)); 

        const jobs = await jobModel.find(filter);

        if (!jobs.length) {
            return res.status(404).json({
                success: false,
                message: 'No jobs found',
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Job Details',
            JobsCount: jobs.length,
            Details: jobs,
        });

    } catch (error) {
        console.error("Error in filterJob:", error.message); 
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};



                                                                                    /* Applied job section */

// APi for apply on job

const apply_on_job = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const {
      first_Name,
      last_Name,
      user_Email,
      city,
      state,
      phone_no,
      gender,
      Highest_Education,
      job_experience,
      Total_experience,
      time_range_for_interview,
    } = req.body;

    if (!jobId) return res.status(400).json({ success: false, message: "job Id required" });
    if (!city) return res.status(400).json({ success: false, message: "Required District" });
    if (!state) return res.status(400).json({ success: false, message: "Required Country" });

    const requiredFields = ["first_Name", "last_Name", "user_Email", "phone_no", "gender", "Highest_Education", "job_experience", "Total_experience"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing ${field.replace("_", " ")}`, success: false });
      }
    }

    const job = await jobModel.findOne({ jobId: jobId, status: 1 });
    if (!job) return res.status(400).json({ success: false, message: "active job not found" });

    const job_Heading = job.job_title;
    const Salary = `${job.salary_pay[0].Minimum_pay} - ${job.salary_pay[0].Maximum_pay}, ${job.salary_pay[0].Rate}`;
    const job_expired_Date = job.endDate;
    const job_status = job.status;
    const empId = job.emp_Id;

    const jobseeker_apply = await appliedjobModel.findOne({ user_Email: user_Email, jobId: jobId });
    if (jobseeker_apply) return res.status(400).json({ success: false, message: "you already applied on this job" });

    const job_description = job.job_Description || '';
    const job_responsibility = job.job_Responsibility || '';
    let combine_jd = `${job_description}\n\n${job_responsibility}`;
    combine_jd = improveTextFormatting(combine_jd);

    const uploadResume = req.file || null;
    if (!uploadResume || !uploadResume.originalname) {
      return res.status(400).json({ success: false, message: "CV required or invalid file" });
    }

    const fileExtension = uploadResume.originalname.split('.').pop().toLowerCase();
    if (!['pdf'].includes(fileExtension)) return res.status(400).json({ success: false, message: "Only PDF files allowed" });

    const resumePath = uploadResume.path || path.join(__dirname, "..", "uploads", uploadResume.filename);
    let cvText = await parsePDF(resumePath);
    cvText = improveTextFormatting(cvText);

    const matchPercentage = calculateMatchPercentage(cvText, combine_jd, job_Heading);
let rating = 1;
const percentage = parseFloat(matchPercentage);

console.log(matchPercentage)

if (percentage >= 80) rating = 5;
else if (percentage >= 60) rating = 4;
else if (percentage >= 40) rating = 3;
else if (percentage >= 20) rating = 2;


    const newData = new appliedjobModel({
      first_Name,
      last_Name,
      user_Email,
      city,
      state,
      phone_no,
      gender,
      Highest_Education,
      job_experience,
      Total_experience,
      time_range_for_interview,
      uploadResume: uploadResume.filename,
      job_Heading,
      Salary,
      job_expired_Date,
      job_status,
      jobId: jobId,
      candidateStatus: 1,
      job_title: job.job_title,
      company_location: job.company_address,
      candidate_rating: rating,
    });

    try {
      const newNotification = await empNotificationModel.create({
        empId: empId,
        message: `${first_Name} applied on job ${job_Heading}`,
        date: new Date(),
        status: 1,
      });
      await newNotification.save();
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    await newData.save();

    const emailContent = `<p>Dear <strong>${first_Name} ${last_Name}</strong>,<br><br>
      Thank you for submitting your application through our portal. We have received your submission and appreciate your interest.<br>
      Only shortlisted candidates will be contacted for the next stage.<br><br>
      Warm Regards,<br>
      <strong>The Recruitment Team</strong><br>
      Smart Start SL Ltd</p>`;

    sendjobEmail(user_Email, "Job Application Confirmation ..!", emailContent);

    return res.status(200).json({
      success: true,
      message: "job Applied successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error_message: error.message,
    });
  }
};

/* Notification section */
// Api for get Notification of the particular employee
const getNotification_emp = async (req, res) => {
    try {
        const empId = req.params.empId
        // check for empId
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'empId required'
            })
        }

        // check for employee
        const checkemp = await employeeModel.findOne({
            _id: empId
        })
        if (!checkemp) {
            return res.status(400).json({
                success: false,
                message: 'client not exist'
            })
        }

        // check for client notification
        const c_Notification = await empNotificationModel.find({
            empId: empId,
            status: 1
        })

        if (!c_Notification) {
            return res.status(200).json({
                success: false,
                message: 'No Notification Yet'
            })
        }


        const sortedNotification = await c_Notification.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({
            success: true,
            message: 'all Notifications of client',
            NotificationCount: sortedNotification.length,
            notification_details: sortedNotification
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}
// Api for seen notification
const seenNotification = async (req, res) => {
    try {
        const notification_id = req.params.notification_id;

        // check for required fields
        if (!notification_id) {
            return res.status(400).json({
                success: false,
                message: 'Notification Id required'
            });
        }

        // Check for notification in both models
        let notification = await empNotificationModel.findOne({ _id: notification_id });

        if (notification) {
            // Update the notification status
            notification.status = 0;
            await notification.save();

            return res.status(200).json({
                success: true,
                message: 'Notification seen '
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Notification not found'
            });
        }
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};
// Api for get unseenNotification count
const unseenNotificationCount = async (req, res) => {
    try {
        const empId = req.params.empId
        // check for empId
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: 'client Id required'
            })
        }

        // check for Notification

        const unseenNotification = await empNotificationModel.find({
            empId: empId,
            status: 1
        })

        if (!unseenNotification) {
            return res.status(200).json({
                success: false,
                message: 'no unseen Notification found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'unseen Notification count',
            unseenNotificationCount: unseenNotification.length
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}
/* Privacy Policy */
// Api for get all client privacy & policy

const get_privacy_policy = async (req, res) => {
    try {
        const all_privacy_policy = await privacy_policyModel.find()
        if (!all_privacy_policy) {
            return res.status(400).json({
                success: false,
                message: 'no privacy & policy found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'privacy & policy',
            Details: all_privacy_policy
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}


/* Term & Condition Section */

const get__admin_term_condition = async (req, res) => {
    try {
        // check for all client term & condition
        const get_t_c = await term_condition.find({})
        if (!get_t_c) {
            return res.status(400).json({
                success: false,
                message: 'No Term & Condition Details found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'term & Conditions',
            Details: get_t_c
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}



/* Api for service page Section */

// Api for get Services Details
const getServices_of_smart_start = async (req, res) => {
    try {
        // check for services 
        const checkService = await services.find({})
        if (!checkService) {
            return res.status(400).json({
                success: false,
                message: 'No services found',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'All Services',
            Details: checkService
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

/*CMS section */
// Api for dashboard counts
const dashboard_counts = async (req, res) => {
    try {
        // check for all active jobs
        const checkActive_jobs = await jobModel.find({
            status: 1
        })
        if (!checkActive_jobs) {
            return res.status(400).json({
                success: false,
                message: 'no active job found'
            })
        }

        // check for all clients
        const all_clients = await employeeModel.find({ status: { $ne: 2 } })
        if (!all_clients) {
            return res.status(400).json({
                success: false,
                message: 'no clients found'
            })
        }

        // check for all candidate 
        const all_candidate = await appliedjobModel.find({})
        if (!all_candidate) {
            return res.status(400).json({
                success: false,
                message: 'no candidates found'
            })
        }

        // check for female candidates

        const all_femaleCandidates = await appliedjobModel.find({
            gender: 'Female'
        })

        if (!all_femaleCandidates) {
            return res.status(400).json({
                success: false,
                message: 'no female candidate found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Dashboard Details',
            active_jobs_count: checkActive_jobs.length,
            all_clients_count: all_clients.length,
            all_cvCount: all_candidate.length,
            all_femaleCandidates_count: all_femaleCandidates.length,
            allCandidates: all_candidate.length


        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// Api for  getJobs_posted_procedure_section1 
const cms_getJobs_posted_procedure_section1 = async (req, res) => {
    try {
        const details = await cms_job_posting_sectionModel.find({});

        if (!details || details.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}
// Api for section 2
const cms_get_need_any_job_section = async (req, res) => {
    try {
        const details = await cms_need_any_job_section_Model.find({});

        if (!details || details.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}

// Api for section 3
const get_cms_post_your_job = async (req, res) => {
    try {
        const details = await cms_postjobModel.find({});

        if (!details || details.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}

const cms_getjob_market_data = async (req, res) => {
    try {
        const details = await cms_jobMarketData.find();

        if (!details || details.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No details found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Details',
            Details: details
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}


// Api for client Dashboard count
const client_dashboardCount = async (req, res) => {
    try {
        const client_id = req.params.client_id;

        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });


        // Check for active jobs
        const active_jobs = await jobModel.find({ emp_Id: client_id, status: 1 });


        // Check for female candidates
        const femaleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Female' });


        // Check for total candidates applied
        const totalCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) } });


        return res.status(200).json({
            success: true,
            message: 'Details',
            totalJobCount: totalJobs.length,
            active_jobsCount: active_jobs.length,
            femaleCandidateCount: femaleCandidates.length,
            totalCandidateCount: totalCandidates.length
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};




/* Contact US Page */

// Api for create Contact us page 

const create_contactUS = async (req, res) => {
    try {
        const { name, email, phone_no, subject, message } = req.body
        // check for required fields

        const requiredFields = ['name', 'email', 'phone_no', 'subject', 'message']
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `missing ${field.replace('_', ' ')} filed`
                })
            }
        }

        // create new Data

        const newData = new contactUsModel({
            name,
            email,
            phone_no,
            subject,
            message
        })

        await newData.save()

        return res.status(200).json({
            success: true,
            message: 'your Query Recieved Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: ' server error',
            error_message: error.message
        })
    }
}


// Api for fixit finder

const fixit_finder = async (req, res) => {
    try {
        const { job_title, company_location } = req.body;
        console.log("Received:", { job_title, company_location });

        if ((job_title && typeof job_title !== "string") || (company_location && typeof company_location !== "string")) {
            return res.status(400).json({
                success: false,
                message: "Job Title and Company Location must be strings",
            });
        }

        // Build the query object
        const query = {};

        if (job_title) {
            query.applicable = { $regex: job_title, $options: "i" };
        }
        if(company_location){
            const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.Location_in_Sierra_Leone = { $regex: escapeRegex(company_location), $options: "i" };
        }

        if (!job_title && !company_location) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least Job Title or Company Location",
            });
        }

        const fixit_candidates = await fixit_finder_model.find(query);
        console.log("Candidates Found:", fixit_candidates.length);

        if (fixit_candidates.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No candidates found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate Details",
            candidateCount: fixit_candidates.length,
            details: fixit_candidates,
        });
    } catch (error) {
        console.error("Error in fixit_finder:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error_message: error.message,
        });
    }
};



/*  upload Resume */
const uploadResume = async (req, res) => {
    try {
        const {
            first_Name,
            last_Name,
            email,
            city,
            phone_no,
            gender,
            job_title,
            Highest_Education,
            candidate_status,
            jobSeeker_status,
            home_address,
            location,
            area_of_qualification
        } = req.body;


        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'Required Destrict'
            })
        }
        // Required fields
        const requiredFields = [
            'first_Name',
            'last_Name',
            'email',
            'phone_no',
            'gender',
            'job_title',
            'Highest_Education'
        ];

        // Check for missing fields
        const missingField = requiredFields.reduce((missing, field) => {
            if (!req.body[field]) {
                return field;
            }
            return missing;
        }, null);

        if (missingField) {
            return res.status(400).json({
                success: false,
                message: `${missingField} required`
            });
        }
        // check for exist user

        const existUser = await ResumeModel.findOne({ user_Email: email })

        if (existUser) {
            return res.status(400).json({
                success: false,
                message: 'already applied with these email'
            })
        }
        const uploadResume = req.file || null;
        if (!uploadResume) {
            return res.status(400).json({
                success: false,
                message: 'Resume required'
            });
        }

        // Check if the uploaded file is a PDF
        const allowedExtensions = ['.pdf'];
        const fileExtension = uploadResume.originalname
            ? `.${uploadResume.originalname.split('.').pop().toLowerCase().trim()}`
            : null;

        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed for resume upload'
            });
        }

        // Add new data, saving the filename as a string
        const newData = new ResumeModel({
            first_Name,
            last_Name,
            user_Email: email,
            city,
            phone_no,
            gender,
            job_Heading: job_title,
            Highest_Education,
            upload_Resume: uploadResume.filename, 
            candidate_status,
            jobSeeker_status,
            home_address,
            location,
            area_of_qualification
        });

        await newData.save();

        return res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for get All uploaded resume 's section candidate profile

const get_upload_section_candidates = async (req, res) => {
    try {
        const get_details = await ResumeModel.find({})

        if (!get_details) {
            return res.status(400).json({
                success: false,
                message: 'No Candidate found'
            })
        }


        return res.status(200).json({
            success: true,
            message: 'all Candidates',
            candidates: get_details
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}


const candidate_recruitment_process_for_uploaded_candidate = async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const { seeker_status } = req.body;

        // Check for candidateId
        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required'
            });
        }

        // Check for candidate
        const candidate = await ResumeModel.findOne({ _id: candidateId });
        if (!candidate) {
            return res.status(400).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        if (seeker_status === 4) {
            candidate.jobSeeker_status = seeker_status
            candidate.candidate_status = 3
        }
        else if (seeker_status === 6) {
            candidate.jobSeeker_status = seeker_status
            candidate.candidate_status = 0
        }
        else {
            candidate.jobSeeker_status = seeker_status
            candidate.candidate_status = 2
        }

        await candidate.save()

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Jobseeker status updated'

        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


   

// Api for get All successfull candidate 

const get_successfull_candidate = async (req, res) => {
    try {
        // Find candidates with jobSeeker_status 4
        const c1 = await appliedjobModel.find({
            jobSeeker_status: 6
        });

        const c2 = await ResumeModel.find({
            jobSeeker_status: 4
        });

        // Combine both results
        const all_successfull_candidate = [...c1, ...c2];

        // Check if no candidates found

        if (all_successfull_candidate.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No candidate found'
            });
        }

        // Sort candidates by createdAt date in descending order
        const sorted_c = all_successfull_candidate.sort((a, b) => b.createdAt - a.createdAt);

        // Prepare the response data
        const responseDetails = sorted_c.map((c) => ({
            first_Name: c.first_Name || c.first_name,
            last_Name: c.last_Name,
            user_Email: c.user_Email,
            city: c.city,
            gender: c.gender,
            job_Heading: c.job_Heading,
            phone_no: c.phone_no,
            Highest_Education: c.Highest_Education,
            jobSeeker_status: c.jobSeeker_status
        }))

        // Send the response
        return res.status(200).json({
            success: true,
            message: 'All Successful Candidates',
            Details: responseDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


/* Blog Details Comment */
// Api for blog Details comment

const blog_section_comment = async (req, res) => {
    try {
        const { Name, email, comment } = req.body
        // check for required fields

        if (!Name) {
            return res.status(400).json({
                success: false,
                message: 'Name Required'
            })
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'email Required'
            })
        }
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: 'comment Required'
            })
        }

        // create New Data
        const newData = new blog_section_comment_Model({
            Name,
            email,
            comment
        })
        await newData.save()

        return res.status(200).json({
            success: true,
            message: 'New Comment Posted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}


// Api for get all blog comment section Details
const get_all__blog_section_comments = async (req, res) => {
    try {
        const all_details = await blog_section_comment_Model.find()
        if (!all_details) {
            return res.status(400).json({
                success: false,
                message: 'no comment found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'all Blog comment',
            Details: all_details
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}




const download_jd = async (req, res) => {
    try {
        const jd_id = req.params.jd_id;
        const jd_download_count = req.query.jd_download_count

        if (!jd_id) {
            return res.status(400).json({
                success: false,
                message: 'Job ID required',
            });
        }

        const jd = await jobDescription_model.findById(jd_id);
        if (!jd) {
            return res.status(400).json({
                success: false,
                message: 'Job Description not found',
            });
        }
        

        jd.jd_download_count = jd_download_count
        await jd.save()
        res.end()

        // const { jobTitle, job_Description, Responsibilities } = jd;

        // const pdfDoc = await PDFDocument.create();
        // const page = pdfDoc.addPage();
        // const { width, height } = page.getSize();

        // const fontSize = 12;
        // const titleFontSize = 20;
        // const headingFontSize = 16;
        // const textColor = rgb(0, 0, 0);
        // const bulletColor = rgb(0.1, 0.1, 0.1);
        // const margin = 50;
        // const maxWidth = width - 2 * margin;

        // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // const wrapText = (text, font, fontSize, maxWidth) => {
        //     const words = text.split(' ');
        //     let lines = [];
        //     let currentLine = words[0];

        //     for (let i = 1; i < words.length; i++) {
        //         const word = words[i];
        //         const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        //         if (width < maxWidth) {
        //             currentLine += ' ' + word;
        //         } else {
        //             lines.push(currentLine);
        //             currentLine = word;
        //         }
        //     }
        //     lines.push(currentLine);
        //     return lines;
        // };

        // const renderNode = (node, x, y, font, fontSize, maxWidth) => {
        //     let currentY = y;

        //     const drawText = (text, options) => {
        //         const lines = wrapText(text, options.font, options.size, maxWidth);
        //         lines.forEach(line => {
        //             page.drawText(line, {
        //                 x: options.x,
        //                 y: currentY,
        //                 size: options.size,
        //                 color: options.color,
        //                 font: options.font,
        //             });
        //             currentY -= options.size + 4;
        //         });
        //     };

        //     if (node.nodeName === '#text') {
        //         const text = node.value.trim();
        //         if (text) {
        //             drawText(text, { x, size: fontSize, color: textColor, font });
        //         }
        //     } else if (node.nodeName === 'b' || node.nodeName === 'strong') {
        //         node.childNodes.forEach(childNode => {
        //             if (childNode.nodeName === '#text') {
        //                 const text = childNode.value.trim();
        //                 if (text) {
        //                     drawText(text, { x, size: fontSize, color: textColor, font });
        //                 }
        //             } else {
        //                 currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
        //             }
        //         });
        //     } else if (node.nodeName === 'i' || node.nodeName === 'em') {
        //         node.childNodes.forEach(childNode => {
        //             if (childNode.nodeName === '#text') {
        //                 const text = childNode.value.trim();
        //                 if (text) {
        //                     drawText(text, { x, size: fontSize, color: textColor, font });
        //                 }
        //             } else {
        //                 currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
        //             }
        //         });
        //     } else if (node.nodeName === 'p' || node.nodeName === 'div') {
        //         node.childNodes.forEach(childNode => {
        //             currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
        //         });
        //         currentY -= 10; // Extra space after paragraph
        //     } else if (node.nodeName === 'ul' || node.nodeName === 'ol') {
        //         node.childNodes.forEach((liNode, index) => {
        //             if (liNode.nodeName === 'li') {
        //                 const bullet = node.nodeName === 'ul' ? '• ' : `${index + 1}. `;
        //                 const bulletWidth = font.widthOfTextAtSize(bullet, fontSize);

        //                 // Draw the bullet
        //                 page.drawText(bullet, {
        //                     x: x,
        //                     y: currentY,
        //                     size: fontSize,
        //                     color: bulletColor,
        //                     font,
        //                 });

        //                 // Draw the list item content with indentation
        //                 currentY = renderNode(liNode, x + bulletWidth + 10, currentY, font, fontSize, maxWidth - bulletWidth - 10);
        //             }
        //         });
        //         currentY -= 10; // Extra space after list
        //     } else {
        //         node.childNodes.forEach(childNode => {
        //             currentY = renderNode(childNode, x, currentY, font, fontSize, maxWidth);
        //         });
        //     }

        //     return currentY;
        // };

        // // Parse HTML and render content
        // const parseAndRenderHTML = (html, startY) => {
        //     const fragment = parse5.parseFragment(html);
        //     let currentY = startY;

        //     fragment.childNodes.forEach(node => {
        //         currentY = renderNode(node, margin, currentY, font, fontSize, maxWidth);
        //     });

        //     return currentY;
        // };

        // // Add job title
        // page.drawText(jobTitle, {
        //     x: margin,
        //     y: height - margin,
        //     size: titleFontSize,
        //     color: rgb(0, 0, 1),
        //     font,
        // });

        // // Add job description
        // page.drawText('Job Description', {
        //     x: margin,
        //     y: height - margin - 40,
        //     size: headingFontSize,
        //     color: rgb(0, 0, 1),
        //     font,
        // });

        // let y = height - margin - 60;
        // y = parseAndRenderHTML(job_Description, y);

        // // Add job responsibilities
        // page.drawText('Job Responsibilities', {
        //     x: margin,
        //     y: y - 20,
        //     size: headingFontSize,
        //     color: rgb(0, 0, 1),
        //     font,
        // });

        // y -= 40;
        // parseAndRenderHTML(Responsibilities, y);

        // const pdfBytes = await pdfDoc.save();

        // res.set({
        //     'Content-Type': 'application/pdf',
        //     'Content-Length': pdfBytes.length,
        //     'Content-Disposition': `attachment; filename=job_description.pdf`,
        // });

        // res.send(Buffer.from(pdfBytes));


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};



// Api for share candidate CV
const share_cv = async (req, res) => {
    try {
        const candidate_id = req.params.candidate_id;
        var { to, subject, message, shareVia, country_code, receiver_no } = req.body;
        var baseUrl = process.env.image_baseURl
        // Check for candidate_id
        if (!candidate_id) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID required'
            });
        }



        // Check for candidate profile
        const candidate = await appliedjobModel.findOne({ _id: candidate_id });
        if (!candidate) {
            return res.status(400).json({
                success: false,
                message: 'Candidate not found'
            });
        }


        // Check for candidate CV
        var candidate_cv = path.resolve(__dirname, '..', 'uploads', candidate.uploadResume);

        if (!fs.existsSync(candidate_cv)) {
            return res.status(400).json({
                success: false,
                message: `Candidate CV not found at path: ${candidate_cv}`
            });
        }

        if (shareVia === 1) {
                   

            // Check for required fields
            if (!to || (typeof to === 'string' && !validator.isEmail(to)) || (Array.isArray(to) && to.length === 0)) {
                return res.status(400).json({
                    success: false,
                    message: 'Receiver email(s) required'
                });
            }
            if (typeof to === 'string') {
                to = [to];
            }
            // if (!from || !validator.isEmail(from)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Valid sender email required'
            //     });
            // }
            if (!subject) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject is required'
                });
            }

            // Validate receiver emails
            for (let email of to) {
                if (!validator.isEmail(email)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid email address in receiver list: ${email}`
                    });
                }
            }

            // Setup nodemailer transporter
            const transporter = nodemailer.createTransport({
                                               host: 'smtpout.secureserver.net',
                                               port: 465, // SSL Port
                                               secure: true, // Enable SSL
                                               auth: {
                                                   user: 'info@smartstartsl.com', // Your email address
                                                   pass: 'z+2w43vtq1', // Your SMTP password
                                               },
                                           });

            // Prepare email options
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: to.join(', '),
                subject: subject,
                text: message || 'Please find the attached CV.',
                attachments: [
                    {
                        filename: candidate.uploadResume,
                        path: candidate_cv,
                        contentType: 'application/pdf'
                    }
                ]
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error sending email',
                        error_message: error.message
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Email sent successfully',

                    });
                }
            });


        }

        else if (shareVia === 2) {
            if (!country_code || !receiver_no) {
                return res.status(400).json({
                    success: false,
                    message: 'Country code and receiver number are required for WhatsApp sharing'
                });
            }


            // Generate WhatsApp sharing link with the CV's public URL
            var waLink = `https://wa.me/${country_code}${receiver_no}?text=${encodeURIComponent(
                message = `${baseUrl}/${candidate.uploadResume}`
            )}`;

            return res.status(200).json({
                success: true,
                message: 'WhatsApp link generated successfully',
                waLink
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid Value of shareVia , use 1 for email and 2 for whatsapp'
            })
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for save candidate profile 
const save_candidate_profile_for_later = async (req, res) => {
    try {
        const { candidate_id } = req.params;

        // Validate candidate_id
        if (!candidate_id) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required.'
            });
        }

        // Check if candidate profile exists
        const candidate = await appliedjobModel.findById(candidate_id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found.'
            });
        }

        // Check if the associated job exists
        const job = await jobModel.findOne({ jobId: candidate.jobId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found for the candidate.'
            });
        }

        // Check if the candidate profile is already saved
        let existingSavedProfile = await save_candidate_profile.findOne({ candidate_id });

        if (existingSavedProfile) {
            // If already saved, unsave and update the candidate status
            await existingSavedProfile.deleteOne();
            candidate.saved_status = 0;
            await candidate.save();

            return res.status(200).json({
                success: true,
                message: 'Candidate profile unsaved successfully.'
            });
        }

        // Save the candidate profile and update the candidate status
        existingSavedProfile = new save_candidate_profile({
            candidate_id,
            client_id: job.emp_Id
        });
        await existingSavedProfile.save();

        candidate.saved_status = 1;
        await candidate.save();

        return res.status(200).json({
            success: true,
            message: 'Candidate profile saved successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error.',
            error_message: error.message
        });
    }
};

// get all the saved candidate profile of the client 
const get_saved_candidate_profile = async (req, res) => {
    try {
        const { client_id } = req.params;

        // Check for client ID
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required.'
            });
        }

        // Get all saved candidates for the client
        const savedProfiles = await save_candidate_profile.find({ client_id });

        // Check if there are any saved profiles
        if (savedProfiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No profiles saved yet.'
            });
        }

        // Retrieve detailed information for each candidate
        const candidateDetails = await Promise.all(
            savedProfiles.map(async (profile) => {
                const candidate = await appliedjobModel.findById(profile.candidate_id).select(
                    'firstname user_Email phone_no city state Total_experience job_experience uploadResume jobSeeker_status'
                );

                if (!candidate) {
                    return null;
                }

                // Format the candidate data
                return {
                    name: candidate.firstname,
                    email: candidate.user_Email,
                    phone_no: candidate.phone_no,
                    location: `${candidate.city}, ${candidate.state}`,
                    Total_experience: candidate.Total_experience,
                    job_experience: candidate.job_experience,
                    CV: candidate.uploadResume,
                    jobSeeker_status: candidate.jobSeeker_status,
                };
            })
        );

        // Filter out null values (in case a candidate ID does not have corresponding data)
        const filteredCandidateDetails = candidateDetails.filter((detail) => detail !== null);

        return res.status(200).json({
            success: true,
            candidates: filteredCandidateDetails,
            message: 'Saved candidate profiles retrieved successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error.',
            error_message: error.message
        });
    }
};
          
// Api for update candidate rating 
const update_candidate_rating = async (req, res) => {
    try {
        const candidate_id = req.params.candidate_id;
        const rating = req.body.rating;

        // Check for candidate ID
        if (!candidate_id) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required'
            });
        }
                     
        // Check if rating is provided and valid
        if (rating === undefined || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Valid rating is required (1 to 5)'
            });
        }

        // Check for candidate
        const candidate = await appliedjobModel.findOne({ _id: candidate_id });
        if (!candidate) {
            return res.status(400).json({
                success: false,
                message: 'Candidate not found'
            });
        }


        // Update candidate rating
        candidate.candidate_rating = rating;
        await candidate.save();

        return res.status(200).json({
            success: true,
            message: 'Rating updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};
           


// Api for get female candidate for client 
const get_female_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;

        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }
                
        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });



        // Check for female candidates
        const femaleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Female' }).sort({ createdAt: -1 }).lean()




        return res.status(200).json({
            success: true,
            message: 'Female Candidate Details',
            femaleCandidate: femaleCandidates
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for male candidate for client
const get_male_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;

        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total job posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });



        // Check for male candidates
        const maleCandidates = await appliedjobModel.find({ jobId: { $in: totalJobs.map(job => job.jobId) }, gender: 'Male' }).sort({ createdAt: -1 }).lean()




        return res.status(200).json({
            success: true,
            message: 'male Candidate Details',
            maleCandidate: maleCandidates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


const build_cv = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            city,
            country,
            zip,
            phoneNo,
            userEmail,
            jobTitleSummary,
            templateType
        } = req.body;

        // Initialize jobExperience, education, skills, etc. as empty arrays
        let jobExperience = [];
        let education = [];
        let skills = [];
        let certificates = [];
        let languagesKnown = [];
        let websitesAndSocialLinks = [];
        let awardsAndAchievements = [];

        // Parse arrays/objects from strings if provided
        if (req.body.jobExperience) {
            if (req.body.jobExperience !== '') {
                jobExperience = JSON.parse(req.body.jobExperience);
            }
        }
        if (req.body.education) {
            if (req.body.education !== '') {
                education = JSON.parse(req.body.education);
            }
        }
        if (req.body.skills) {
            if (req.body.skills !== '') {
                skills = JSON.parse(req.body.skills);
            }
        }
        if (req.body.certificates) {
            if (req.body.certificates !== '') {
                certificates = JSON.parse(req.body.certificates);
            }
        }
        if (req.body.languagesKnown) {
            if (req.body.languagesKnown !== '') {
                languagesKnown = JSON.parse(req.body.languagesKnown);
            }
        }
        if (req.body.websitesAndSocialLinks) {
            if (req.body.websitesAndSocialLinks !== '') {
                websitesAndSocialLinks = JSON.parse(req.body.websitesAndSocialLinks);
            }
        }
        if (req.body.awardsAndAchievements) {
            if (req.body.awardsAndAchievements !== '') {
                awardsAndAchievements = JSON.parse(req.body.awardsAndAchievements);
            }
        }

        // Handling file upload (profileImage)
        let profileImage = '';
        if (req.file) {
            profileImage = req.file.filename;
        }

        // Initialize a new CV document
        let newCv = new CvBuilderModel({
            firstName,
            lastName,
            city,
            country,
            zip,
            phoneNo,
            userEmail,
            jobTitleSummary,
            templateType,
            profileImage: profileImage
        });

        // Add job experience
        if (jobExperience.length > 0) {
            jobExperience.forEach(exp => {
                if (exp.isCurrentlyWorking === 1) {
                    exp.endDate = undefined;
                }
                newCv.jobExperience.push(exp);
            });
        }

        // Add education
        if (education.length > 0) {
            education.forEach(edu => {
                if (edu.graduationDate && edu.graduationDate.isStillEnrolled === 1) {
                    edu.graduationDate.end_Date = undefined;
                }
                newCv.Education.push(edu);
            });
        }

        // Add skills
        if (skills.length > 0) {
            skills.forEach(skill => {
                newCv.skills.push(skill);
            });
        }

        // Add certificates
        if (certificates.length > 0) {
            certificates.forEach(certificate => {
                newCv.certificates.push(certificate);
            });
        }

        // Add languages known
        if (languagesKnown.length > 0) {
            languagesKnown.forEach(language => {
                newCv.languagesKnown.push(language);
            });
        }

        // Add websites and social links
        newCv.websitesAndSocialLinks = websitesAndSocialLinks;

        // Add awards and achievements
        if (awardsAndAchievements.length > 0) {
            awardsAndAchievements.forEach(award => {
                newCv.awardsAndAchievements.push(award);
            });
        }

        // Save the new CV to the database
        await newCv.save();

        // Send success response with status 201 (created)
        return res.status(200).json({
            success: true,
            message: 'CV Build Successfully',
            data: newCv
        });
    } catch (error) {
        // Handle server error
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get all candidate  for client
const get_all_candidate_for_client = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const gender = req.query.gender;

        // Check for client id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check total jobs posted by client
        const totalJobs = await jobModel.find({ emp_Id: client_id });

        // Check for all candidates
        const allCandidates = await appliedjobModel
            .find({ jobId: { $in: totalJobs.map(job => job.jobId) } })
            .sort({ createdAt: -1 })
            .lean();

        // Apply gender filter if provided, otherwise return all candidates
        let filteredCandidates = allCandidates;
        if (gender) {
            if (gender === "Male" || gender === "Female") {
                filteredCandidates = allCandidates.filter(candidate => candidate.gender === gender);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid gender value"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'All Candidate Details',
            candidates: filteredCandidates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};





// Api for export all candidate of the client
const export_client_jobs_candidate = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const { gender } = req.query;

        // Check for client ID
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required'
            });
        }

        // Check for client existence
        const client = await employeeModel.findById(client_id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check for gender
        if (!gender) {
            return res.status(400).json({
                success: false,
                message: 'Gender is required'
            });
        }

        // Get jobs posted by the client
        const totalJobs = await jobModel.find({ emp_Id: client_id });
        if (totalJobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jobs found for this client'
            });
        }

        // Get total candidates applied (with gender filter)
        const totalCandidates = await appliedjobModel.find({
            jobId: { $in: totalJobs.map(job => job.jobId) },
            gender: gender
        });

        if (totalCandidates.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No ${gender} candidates found for the jobs posted by this client`
            });
        }

        // Create Excel workbook and worksheet
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet("Candidates");

        // Define the Excel Header
        worksheet.columns = [
            { header: "First Name", key: "first_Name", width: 15 },
            { header: "Last Name", key: "last_Name", width: 15 },
            { header: "User Email", key: "user_Email", width: 25 },
            { header: "District", key: "city", width: 15 },
            { header: "Phone Number", key: "phone_no", width: 15 },
            { header: "Status", key: "jobSeeker_status", width: 15 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "Job Heading", key: "job_Heading", width: 20 },
            { header: "Job ID", key: "jobId", width: 10 },
            { header: "Highest Education", key: "Highest_Education", width: 20 },
            { header: "Total Experience", key: "Total_experience", width: 15 },
            { header: "CV", key: "uploadResume", width: 25 },
            { header: "Candidate Rating", key: "candidate_rating", width: 15 }
        ];

        // Add filtered candidates data to the worksheet
        totalCandidates.forEach(candidate => {
            worksheet.addRow({
                first_Name: candidate.first_Name,
                last_Name: candidate.last_Name,
                user_Email: candidate.user_Email,
                city: candidate.city,
                phone_no: candidate.phone_no,
                jobSeeker_status: candidate.jobSeeker_status,
                gender: candidate.gender,
                job_Heading: candidate.job_Heading,
                jobId: candidate.jobId,
                Highest_Education: candidate.Highest_Education,
                Total_experience: candidate.Total_experience,
                uploadResume: candidate.uploadResume,
                candidate_rating: candidate.candidate_rating
            });
        });

        // Set response headers for downloading the Excel file
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${gender}_candidates.xlsx`
        );

        // Generate and send the Excel File as a response
        await workbook.xlsx.write(res);

        // End the response
        res.end();

    } catch (error) {
        console.error("Error exporting candidates:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for add psychometric  TEST

const psychometric_test = async (req, res) => {
    try {
        let client_id = req.params.client_id
        let { category_id, question, correctAnswerIndex } = req.body;
        let options = req.body.options

        //check for client id 
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client Id Required'
            })
        }

        // check for client
        let client = await employeeModel.findOne({ _id: client_id })
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not Found'
            })
        }

        // check for category
        let category = await psychometric_test_Category_Model.findOne({ _id: category_id })
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'category not exist'
            })
        }

        // check for test already exist for client
        let exist_test = await Psychometric_test_Model.findOne({ client_id, category_id })
        if (exist_test) {
            return res.status(400).json({
                success: false,
                message: 'Test Already Exist'
            })
        }

        let question_image = ''
        if (req.file) {
            question_image = req.file.filename
        }

        // Check if question is provided and is a non-empty string
        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Question is required'
            });
        }

        try {
            options = JSON.parse(options);
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: 'Options must be a valid JSON array'
            });
        }
        // Check if options array is provided and is not empty
        if (!Array.isArray(options) || options.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Options array is required'
            });
        }

        // Check if correctAnswerIndex is provided and is a number
        if (correctAnswerIndex) {
            correctAnswerIndex = parseInt(correctAnswerIndex)
        }

        // Create a new psychometric question
        let newPsychometric = new Psychometric_test_Model({
            client_id,
            category_id,
            category_name: category.category_name,
            questions_Bank: [{
                question,
                question_image: question_image,
                options,
                correct_answer_index: correctAnswerIndex
            }]
        });

        // Save the new question
        await newPsychometric.save();

        res.status(200).json({
            success: true,
            message: 'Psychometric test added successfully',

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get Detials of psychometric_Test
const get_test = async (req, res) => {
    try {
        const { test_id } = req.params;

        // Check for psychometric_questions_Id
        if (!test_id) {
            return res.status(400).json({
                success: false,
                message: 'psychometric_test_id is required'
            });
        }

        // Fetch details from the database
        const psy_test = await Psychometric_test_Model.findById(test_id);

        if (!psy_test) {
            return res.status(404).json({
                success: false,
                message: 'No test found'
            });
        }

        // Respond with the question details
        return res.status(200).json({
            success: true,
            message: 'Test details',
            test_details: {
                category_name: psy_test.category_name,
                status: psy_test.status,
                questions_Bank: psy_test.questions_Bank

            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}




// get all psychometric_questions options for particular 

const getAll_psychometric_test_of_client = async (req, res) => {
    try {
        const client_id = req.params.client_id
        // check for client Id
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client id Required'
            })
        }

        // check for client
        const client = await employeeModel({ _id: client_id })
        if (!client) {
            return res.status(400).json({
                sucess: false,
                message: 'Client not found'
            })
        }

        // check for all psychometric_Test

        const checkpsychometric_T = await Psychometric_test_Model.find({
            client_id
        })

        if (!checkpsychometric_T) {
            return res.status(400).json({
                success: false,
                message: `no psychometric Test Found for the client`
            })
        }

        // sort data

        const sorteddata = checkpsychometric_T.sort((a, b) => b.createdAt - a.createdAt)

        return res.status(200).json({
            success: true,
            message: `psychometric Test of client`,
            Test: sorteddata

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}


// Api for add question in test
const add_question_in_test = async (req, res) => {
    try {
        let test_id = req.params.test_id
        let { question, options, correct_answer_index } = req.body
        // check for test_id
        if (!test_id) {
            return res.status(400).json({
                success: false,
                message: 'Test Id Required'
            })
        }

        // check for test
        const test = await Psychometric_test_Model.findOne({ _id: test_id })
        if (!test) {
            return res.status(400).json({
                success: false,
                message: 'Test Not found'
            })
        }

        // check for question already exist
        const duplicate_question = test.questions_Bank.find(
            (ques) => ques.question === question
        )

        if (duplicate_question) {
            return res.status(400).json({
                success: false,
                message: 'Question already exist in the test'
            })
        }

        try {
            options = JSON.parse(options);
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: 'Options must be a valid JSON array'
            });
        }

        let question_image = ''
        if (req.file) {
            question_image = req.file.filename
        }
        test.questions_Bank.push({
            question,
            question_image: question_image || '',
            options,
            correct_answer_index
        })

        await test.save()
        return res.status(200).json({
            success: true,
            message: 'Question added successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}

// Api for delete Question in test
const delete_question_in_psychometric_test = async (req, res) => {
    const { test_id, questionId } = req.params;

    try {

        // check for test_id 
        if (!test_id) {
            return res.status(400).json({
                success: false,
                message: 'test_id Required'
            })
        }
        // check for test_id 
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'questionId Required'
            })
        }
        // Check for test existence
        const exist_test = await Psychometric_test_Model.findById(test_id);
        if (!exist_test) {
            return res.status(400).json({
                success: false,
                message: 'Test does not exist',
            });
        }

        // Check for question existence in the test
        const questionIndex = exist_test.questions_Bank.findIndex(
            (question) => question._id.toString() === questionId
        );

        if (questionIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'Question not found',
            });
        }

        // Remove question from the question bank
        exist_test.questions_Bank.splice(questionIndex, 1);

        // Save updated test data
        await exist_test.save();

        return res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};
// Api for delete psychometric_test

const deletepsychometrcTest = async (req, res) => {
    try {
        const psychometric_id = req.params.psychometric_id
        // check for psychometric_id
        if (!psychometric_id) {
            return res.status(400).json({
                success: false,
                message: 'psychometric Id required'
            })
        }

        // check for psychometric_test
        const pt = await Psychometric_test_Model.findOne({
            _id: psychometric_id
        })

        if (!pt) {
            return res.status(400).json({
                success: false,
                message: 'no Test found'
            })
        }

        await pt.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'psychometric test Deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}

// Api for add personality test question for psychometric section

const add_test_Category = async (req, res) => {
    try {
        const { category_name } = req.body;

        // Validate that the category_name is provided 
        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'category_name is required '
            });
        }

        // Check if the category_name already exists in the database
        const existcategory_name = await psychometric_test_Category_Model.findOne({ category_name });
        if (existcategory_name) {
            return res.status(400).json({
                success: false,
                message: `category , ${category_name} already exists`
            });
        }

        // Create a new category_name
        const newcategory_name = new psychometric_test_Category_Model({
            category_name
        });

        // Save the new newcategory_name to the database
        await newcategory_name.save();

        return res.status(200).json({
            success: true,
            message: 'Category name added successfully',

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
}

// Api for Get all psychometric personal Ability Questions
const getAll_psychometric_Category = async (req, res) => {
    try {

        // check for all category

        const check_Category = await psychometric_test_Category_Model.find({
        })

        if (!check_Category) {
            return res.status(400).json({
                success: false,
                message: `no check_Category Found for Psychometric Test`
            })
        }

        // sort data

        const sorteddata = check_Category.sort((a, b) => b.createdAt - a.createdAt)

        return res.status(200).json({
            success: true,
            message: `All Categories for personality Test`,
            Category: sorteddata.map((m) => ({
                category_id: m._id,
                category_name: m.category_name
            }))

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}


// Api for delete Category
const Delete_category = async (req, res) => {
    try {
        const category_id = req.params.category_id
        // check for category_id
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: 'category Id required'
            })
        }

        //check for category
        const category = await psychometric_test_Category_Model.findOne({ _id: category_id })
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'No category found'
            })
        }

        await category.deleteOne()
        return res.status(200).json({
            success: true,
            message: 'category Deleted Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server error',
            error_message: error.message
        })
    }
}



/* online courses USER  */
// Api for User Enroll

const courses_user_enroll = async (req, res) => {
    try {
        const { first_name, last_name, email, password, gender, phone_no } = req.body

        const requiredFields = ['first_name', 'last_name', 'email', 'gender', 'password', 'phone_no']
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Required ${field.replace('_', ' ')}`
                })
            }
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter valid Email'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        // check for already exist user

        const exist_user = await courses_user_enroll_Model.findOne({ email })
        if (exist_user) {
            return res.status(400).json({
                success: false,
                message: 'You Already Enrolled ...!'
            })
        }

        let profileImage = null
        if (req.file) {
            profileImage = req.file.filename
        }

        // add new user
        const new_enroll_user = new courses_user_enroll_Model({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone_no,
            gender,
            status: 1,
            profileImage,
            courses: []
        })

        await new_enroll_user.save()

        return res.status(200).json({
            success: true,
            message: 'Enrolled Successfully ..!'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }

}


// Api for get all Enrolled User
const all_enrolled_user = async (req, res) => {
    try {
        // check for all user
        const enrolled_user = await courses_user_enroll_Model.find({}).sort({ createdAt: -1 }).lean()
        if (!enrolled_user) {
            return res.status(400).json({
                success: false,
                message: 'No User Enrolled yet'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Enrolled User',
            enrolled_user: enrolled_user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}


// Api for enrolled_user_login

const enrolled_user_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        // Check for enrolled user
        const enrolled_user = await courses_user_enroll_Model.findOne({ email });
        if (!enrolled_user) {
            return res.status(400).json({
                success: false,
                message: 'Enrolled user not found'
            });
        }

        // Check if the stored password is in plain text

        if (enrolled_user.password && enrolled_user.password.startsWith("$2b$")) {
            // Compare password
            const passwordMatch = await bcrypt.compare(password, enrolled_user.password);
            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Password Incorrect'
                });
            }
        }
        else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the stored password in the database
            enrolled_user.password = hashedPassword;
            await enrolled_user.save();
        }
        // Successful login response
        return res.status(200).json({
            success: true,
            message: 'Enrolled user logged in successfully',
            enrolled_user
        });

    } catch (error) {
        // Error handling
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for enroll course
const enroll_course = async (req, res) => {
    try {
        let user_id = req.params.user_id;
        let { course_id, booking_id, status } = req.body;

        // Check if course_id is provided

        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course Id is required'
            });
        }

        // Check if user_id is provided
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required'
            });
        }

        const enroll_user = await courses_user_enroll_Model.findById(user_id);

        if (!enroll_user) {

            return res.status(400).json({
                success: false,
                message: 'User Not Found'
            });
        }

        // Check for the existence of the course
        const course = await cms_online_courses_Model.findById(course_id);

        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course does not exist'
            });

        }

        if (status === 1) {

            const transaction = await course_transaction_model.findOne({ booking_id: booking_id })
            if (transaction) {
                transaction.course_id = course_id
                transaction.enroll_user_id = user_id
                transaction.user_name = `${enroll_user.first_name} ${enroll_user.last_name}`,
                transaction.course_name = course.Heading,
                transaction.payment_status = 'STATE_COMPLETED'

                await transaction.save()

                // Enroll the user in the course by adding the course 
                enroll_user.courses.push({
                    course_id: course_id,
                    enroll_Date: new Date(),
                    course_status: 'Accepted'
                });

                const emailContent = `<!DOCTYPE html>
                                <html>
                                <head>
                                <title>Enrollment Successful</title>
                                </head>
                                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

                                <div style="max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

                                <!-- Header Section -->
                                <div style="background-color: #2E86C1; color: #fff; padding: 20px; text-align: center;">
                                <h1 style="margin: 0; font-size: 24px;">Enrollment Successful!</h1>
                                </div>

                                <!-- Content Section -->
                                <div style="padding: 20px;">
                                <p style="font-size: 16px; color: #333;">Dear <strong>${enroll_user.first_name} ${enroll_user.last_name} </strong>,</p>

                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                We are happy to inform you that you have successfully enrolled in <strong>${course.Heading}</strong>.
                                </p>

                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Our team will contact you shortly with more details. Thank you for choosing our service, and we look forward to supporting your learning journey!
                                </p>

                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                If you have any questions, feel free to reach out to us at 
                                <a href="mailto:info@smartstart.sl" style="color: #2E86C1; text-decoration: none;">Support Team</a>.
                                </p>

                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Thank you once again!
                                </p>
                                </div>

                                <!-- Footer Section -->
                                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e8e8e8;">
                                <p style="font-size: 14px; color: #666; margin: 0;">
                                Best regards,<br><strong> Smart Start SL Ltd</strong>
                                </p>
                                </div>
                                </div>

                                </body>
                                </html>
                                `
                await sendEmails(enroll_user.email, "Enrollment Successful", emailContent);

                await enroll_user.save();

                // manage topic in other table
                course.topic = course.topic.map((item, index) => {
                    return {
                        ...item,
                        topic_status: index === 0 ? 1 : 0
                    };
                });
                
                const manage_topic = new user_enrolled_course_toic_manage_Model({
                    enroll_user_id: enroll_user._id,
                    course_name: course.Heading,
                    course_id: course._id,
                    topic: course.topic
                })

                await manage_topic.save()
                // Check each topic's _id and find corresponding quizzes
                for (const topic of course.topic) {
                    const quizzes = await online_course_quiz_Model.find({ topic_id: topic._id });

                    // If quizzes are found, save them in user_enrolled_course_toic_quiz_manage_Model
                    for (const quiz of quizzes) {
                        const quizManage = new user_enrolled_course_toic_quiz_manage_Model({
                            enroll_user_id: enroll_user._id,
                            course_id: course._id,
                            course_name: course.Heading,
                            topic_name: topic.topic_name,
                            topic_id: topic._id,
                            questions_Bank: quiz.questions_Bank,

                        });

                        await quizManage.save();
                    }
                }

                return res.status(200).json({
                    success: true,
                    message: 'User successfully enrolled in the course'
                });
            }


            else {
                return res.status(400).json({
                    success: false,
                    message: `Transaction not found for the booking_id  : ${booking_id}`
                })
            }

        }
        else {
            const transaction = await course_transaction_model.findOne({ booking_id: booking_id })
            if (transaction) {
                transaction.course_id = course_id
                transaction.enroll_user_id = user_id
                transaction.payment_status = 'STATE_FAILED',
                    transaction.user_name = `${enroll_user.first_name} ${enroll_user.last_name}`,
                    transaction.course_name = course.Heading,

                    await transaction.save()

                return res.status(200).json({
                    success: false,
                    message: `You are unable to enroll in the course due to a payment failure`
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: `Transaction not found for the booking_id  : ${booking_id}`
                })
            }
        }
         

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for update the status of the course
const update_course_status = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // Check if course_id is provided
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course Id is required'
            });
        }

        const course = await cms_online_courses_Model.findById(course_id);
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course does not exist'
            });
        }

        // Check if user_id is provided
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required'
            });
        }

        // Check if the user is enrolled in the course
        const enrollment = await courses_user_enroll_Model.findOne({
            _id: user_id,
            'courses.course_id': course_id
        });

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: 'Enrollment not found for the given user and course'
            });
        }

        // Update the course status to 'Accepted'
        const updatedEnrollment = await courses_user_enroll_Model.findOneAndUpdate(
            {
                _id: user_id,
                'courses.course_id': course_id
            },
            {
                $set: {
                    'courses.$.status': 'Accepted'
                }
            },
            { new: true }
        );
        const emailContent = `<!DOCTYPE html>
<html>
<head>
<title>Course Enrollment Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
<div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">

<!-- Header Section -->
<div style="background-color: #2E86C1; padding: 20px; text-align: center;">
<h1 style="margin: 0; color: #ffffff; font-size: 24px;">Course Enrollment Accepted</h1>
</div>

<!-- Body Content -->
<div style="padding: 20px;">
<p style="font-size: 16px; color: #333;">Dear <strong>${enrollment.full_name} ${enrollment.last_name} </strong>,</p>

<p style="font-size: 16px; color: #333; line-height: 1.6;">
   We are excited to inform you that your enrollment status for the course <strong>${course.Heading}</strong> has been successfully  <strong>Accepted</strong>.
</p>

<p style="font-size: 16px; color: #333; line-height: 1.6;">
   Our team will reach out to you soon with further details regarding the next steps. We appreciate your trust in our services and are looking forward to supporting your learning journey.
</p>

<p style="font-size: 16px; color: #333; line-height: 1.6;">
   Should you have any questions, feel free to contact us at 
   <a href="mailto:info@smartstart.sl" style="color: #2E86C1; text-decoration: none;">Support Email</a>.
</p>

<p style="font-size: 16px; color: #333; line-height: 1.6;">
   Thank you for choosing us!
</p>
</div>

<!-- Footer Section -->
<div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e8e8e8;">
<p style="font-size: 14px; color: #666; margin: 0;">
   Best regards,<br><strong>Smart Start SL Ltd</strong>
</p>
</div
`
        await sendEmails(enrollment.email, 'Course Enrollment Accepted', emailContent)
        return res.status(200).json({
            success: true,
            message: 'Course Enrollment Accepted',

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for get_my_courses 
const get_my_enrolled_courses = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Check if user_id is provided
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required',
            });
        }

        // Check for user enrollment
        const user = await courses_user_enroll_Model.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not Found',
            });
        }

        // Get enrolled courses and retrieve course details
        const enrolled_courses = await Promise.all(
            user.courses.map(async (course) => {
                const courseDetails = await cms_online_courses_Model.findById(course.course_id);

                // Fetch topics from user_enrolled_course_topic_manage_Model using user_id and course_id
                const userCourseTopic = await user_enrolled_course_toic_manage_Model.findOne({
                    enroll_user_id: user_id,
                    course_id: course.course_id,
                });



                // Extract the topics if found
                const courseTopics = userCourseTopic ? userCourseTopic.topic : 'Course Topics not found';

                return {
                    course_id: course.course_id,
                    course_name: courseDetails ? courseDetails.Heading : 'Course not found',
                    course_Description: courseDetails ? courseDetails.Description : 'Course Description not Found',
                    course_Detailed_Description: courseDetails ? courseDetails.Detailed_description : 'Course Detailed Description not Found',
                    course_Price: courseDetails ? courseDetails.price : 'Course Price not Found',
                    course_Image: courseDetails ? courseDetails.image : 'Course Image not Found',
                    cours_Topic: courseTopics || 'course topic not found',
                    enroll_Date: course.enroll_Date,
                    course_status: course.status,
                };
            })
        );

        // Return the response with enrolled courses
        return res.status(200).json({
            success: true,
            message: 'My Enrolled Courses',
            enrolled_courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
}

const delete_all_notification_of_user = async (req, res) => {
    try {
        // Delete all notifications from empNotificationModel
        await empNotificationModel.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'All notifications deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for ger all enrolled user for a course
const get_enrolled_users_count = async (req, res) => {
    try {
        const { course_id } = req.params;

        // Check if course_id is provided
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course Id is required'
            });
        }

        // Find all users who have enrolled in the specified course
        const usersEnrolled = await courses_user_enroll_Model.find({
            'courses.course_id': course_id
        });


        // Return the response with the count of enrolled users
        return res.status(200).json({
            success: true,
            message: `Enrolled User`,
            enrolled_users_count: usersEnrolled.length,
            enrolled_user: usersEnrolled.map((m) => ({
                first_name: m.first_name,
                last_name: m.last_name,
                email: m.email,
                phone_no: m.phone_no
            }))
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// Api for get particular topic Quiz
const topic_quiz = async (req, res) => {
    try {
        const topic_id = req.params.topic_id
        // check for topic id
        if (!topic_id) {
            return res.status(400).json({
                success: false,
                message: 'Topic Id Required'
            })
        }

        const topic_q = await online_course_quiz_Model.find({ topic_id }).sort({ createdAt : -1 }).lean()

        if (!topic_q) {
            return res.status(400).json({
                success: false,
                message: 'No Quiz Found for the Topic'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Quiz of Topic',
            Topic_quiz: topic_q.map((m) => ({
                topic_name: m.topic_name,
                topic_id: m.topic_id,
                quiz_id: m._id,
                topic_quiz: m.questions_Bank


            }))
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message

        })
    }
}

const enroll_user_course_topic_quiz = async (req, res) => {
    try {
        const { enroll_user_id, topic_id } = req.params;

        // Check for required fields
        if (!enroll_user_id) {
            return res.status(400).json({
                success: false,
                message: 'Enroll_user_id is required'
            });
        }

        if (!topic_id) {
            return res.status(400).json({
                success: false,
                message: 'Topic_id is required'
            });
        }

        // Fetch the quiz for the given user and topic
        const topicQuiz = await user_enrolled_course_toic_quiz_manage_Model.findOne({
            enroll_user_id,
            topic_id
        });

        if (!topicQuiz) {
            return res.status(404).json({
                success: false,
                message: 'No quiz found for the specified topic'
            });
        }
                    
        // Respond with the quiz details
        return res.status(200).json({
            success: true,
            message: ' Topic Quiz',
            enroll_user_id: enroll_user_id,
            topic_quiz: {
                topic_name: topicQuiz.topic_name,
                topic_id: topicQuiz.topic_id,
                quiz_id: topicQuiz._id,
                questions_bank: topicQuiz.questions_Bank
            }
        });

    } catch (error) {
        console.error('Error fetching quiz:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

// Api for updatee the course topic status

const update_topic_status = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const topic_id = req.params.topic_id;

        // check for required fields
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        if (!topic_id) {
            return res.status(400).json({
                success: false,
                message: 'Topic ID is required',
            });
        }

        // Find the user-enrolled course with the matching topic
        const enrolledCourse = await user_enrolled_course_toic_manage_Model.findOne({
            enroll_user_id: user_id,
            'topic': {
                $elemMatch: { _id: topic_id },
            },
        });

        // Check if the topic exists in the user's enrolled course
        if (!enrolledCourse) {
            return res.status(400).json({
                success: false,
                message: `Enrolled course'topic not found`,
            });
        }

        const updatedTopic = await user_enrolled_course_toic_manage_Model.updateOne(
            {
                enroll_user_id: user_id,
                'topic._id': topic_id,
            },
            {
                $set: { 'topic.$.topic_status': 1 },
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Topic Activated for user',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};

const save_user_quiz_record_of_course_topic = async (req, res) => {
    try {
        const { enroll_user_id, course_id
        } = req.params;
        const { topic_id, questions_Bank } = req.body;

        // Check for required fields
        if (!enroll_user_id || !topic_id || !Array.isArray(questions_Bank) || questions_Bank.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Enroll User ID, Topic ID, and non-empty Questions Bank array are required.',
            });
        }

        // Access the topic details
        const topicDetail = await user_enrolled_course_toic_manage_Model.findOne({ enroll_user_id, course_id });
        if (!topicDetail) {
            return res.status(400).json({
                success: false,
                message: 'No topic details found for the given Enroll User ID.',
            });
        }

        var topicArray = topicDetail.topic;





        if (!Array.isArray(topicArray) || topicArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No topics found for the given user.',
            });
        }




        // Find the existing quiz record
        let quizRecord = await user_enrolled_course_toic_quiz_manage_Model.findOne({ enroll_user_id, topic_id });
        if (!quizRecord) {
            return res.status(400).json({
                success: false,
                message: 'Quiz record not found for the given user and topic.',
            });
        }

        // Handle unique questions and update quiz record
        const uniqueQuestions = Array.from(new Set(questions_Bank.map(q => q._id)))
            .map(id => questions_Bank.find(q => q._id === id));

        uniqueQuestions.forEach(question => {
            const { _id, user_answer } = question;

            if (!user_answer) {
                return res.status(400).json({
                    success: false,
                    message: `User answer is missing for question ID: ${_id}.`,
                });
            }

            const questionIndex = quizRecord.questions_Bank.findIndex(q => q._id.toString() === _id.toString());

            if (questionIndex !== -1) {
                // Update existing question's user_answer
                quizRecord.questions_Bank[questionIndex].user_answer = user_answer;
            } else {
                // Add new question
                quizRecord.questions_Bank.push({
                    question_id: _id,
                    user_answer
                });
            }
        });

        // Calculate the result
        const totalQuestions = quizRecord.questions_Bank.length;
        const correctAnswers = quizRecord.questions_Bank.filter(question =>
            question.correct_answer && question.user_answer &&
            question.correct_answer.toString() === question.user_answer
        ).length;

        const user_result = (correctAnswers / totalQuestions) * 100;
        quizRecord.answer_percent = user_result;

        // Save the updated quiz record
        await quizRecord.save();


        // Check if user_result is 80 or more (allowing string or number)
        const resultThreshold = Number(user_result);




        // Check if the user has met the result threshold
        // Check if the user has met the result threshold
        let t_status = resultThreshold >= 80;

        if (!t_status) {
            // If not meeting the threshold, return a response indicating the requirement
            return res.status(200).json({
                success: true,
                message: 'You have not reached the 80 percent score requirement. Please review and try again to achieve the desired result.',
                user_result,
                t_status
            });
        } else {
            // Find the current topic



            const currentTopic = topicArray.find(topic => topic._id.equals(topic_id));



            if (currentTopic) {
                // Update the current topic status to 2 (completed)
                await user_enrolled_course_toic_manage_Model.updateOne(
                    { enroll_user_id, course_id },
                    { $set: { 'topic.$[t].topic_status': 2 } },
                    { arrayFilters: [{ 't._id': topic_id }] }
                );

                // Find the next topic
                const currentTopicIndex = topicArray.findIndex(topic => topic._id.toString() === topic_id.toString());

                // Check if there is a next topic
                if (currentTopicIndex + 1 < topicArray.length) {
                    const nextTopic = topicArray[currentTopicIndex + 1];

                    // Update the next topic status to 1 (active)
                    await user_enrolled_course_toic_manage_Model.updateOne(
                        { enroll_user_id, course_id },
                        { $set: { 'topic.$[t].topic_status': 1 } },
                        { arrayFilters: [{ 't._id': nextTopic._id }] }
                    );
                }
            }
        }


        return res.status(200).json({
            success: true,
            message: 'User quiz record updated successfully.',
            user_result,
            t_status
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


// Api for get particular enrolled course Details
const get_particular_enrolled_course_details = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // Check if user_id is provided
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required',
            });
        }

        // Check for user enrollment
        const user = await courses_user_enroll_Model.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not Found',
            });
        }

        // check for course

        const enrolledCourse = user.courses.find(course => course.course_id.toString() === course_id);
        if (!enrolledCourse) {
            return res.status(400).json({
                success: false,
                message: 'User not Enroll the Course Yet',
            });
        }

        // Fetch course details from the cms_online_courses_Model
        const courseDetails = await cms_online_courses_Model.findById(course_id);
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: 'Course details not found',
            });
        }

        // Fetch topics from user_enrolled_course_topic_manage_Model using user_id and course_id
        const userCourseTopic = await user_enrolled_course_toic_manage_Model.findOne({
            enroll_user_id: user_id,
            course_id: course_id,
        });

        // Extract the topics if found
        const courseTopics = userCourseTopic ? userCourseTopic.topic : 'Course topics not found';

        // Fetch user quiz records for the specified course and user
        const userResponses = await user_enrolled_course_toic_quiz_manage_Model.find({
            enroll_user_id: user_id,
            course_id: course_id,
        });


        // Check if there are any records
        if (userResponses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No quiz records found for the given user and course',
            });
        }




        const total_marks = userResponses.length


        let download_certificate;
        let totalDays;
        let formattedDate;
        let user_name

        const user_totalMarks = userResponses.reduce((sum, response) => {
            const score = parseInt(response.answer_percent);
            return sum + (isNaN(score) ? 0 : score);  // Default to 0 if NaN 
        }, 0);

        const averageMarks = user_totalMarks / total_marks 

        // Fetch user quiz records for the specified course and user
        const check_last_topic_status = await user_enrolled_course_toic_manage_Model.find({
            enroll_user_id: user_id,
            course_id: course_id,
        });


        // Get the last index of the topic array
        const lastIndex = check_last_topic_status[0].topic.length - 1;
        const last_topic = check_last_topic_status[0].topic[lastIndex].topic_status




        if (averageMarks < 80 || last_topic !== 2) {
            download_certificate = 0;
        } else {
            download_certificate = 1;
            const course_start_time = userCourseTopic.createdAt;
            const course_end_time = userCourseTopic.updatedAt;

            const startTime = new Date(course_start_time);
            const endTime = new Date(course_end_time);

            // Calculate the time difference in milliseconds
            const timeDifference = endTime - startTime;

            // Convert milliseconds to days
            totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            const option = { year: 'numeric', month: 'long', day: 'numeric' };
            formattedDate = startTime.toLocaleDateString('en-US', option);
            user_name = `${user.first_name} ${user.last_name}`

        }



        // Prepare course details response
        const courseData = {
            course_id: course_id,
            course_name: courseDetails.Heading || 'Course name not found',
            course_Description: courseDetails.Description || 'Course description not found',
            course_Detailed_Description: courseDetails.Detailed_description || 'Detailed description not found',
            course_Price: courseDetails.price || 'Price not found',
            course_Image: courseDetails.image || 'Image not found',
            course_Topic: courseTopics || 'Course topics not found',
            enroll_Date: enrolledCourse.enroll_Date,
            course_status: enrolledCourse.status,
            download_certificate: download_certificate,
            course_complete_days: totalDays,
            Date: formattedDate,
            user_name: user_name,
            number_of_quiz: total_marks

        };

        // Return the response with particular course details
        return res.status(200).json({
            success: true,
            message: 'Course details fetched successfully',
            course: courseData,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}



// Api for get particular enrolled user detaisl
const get_enrolled_user_detail = async (req, res) => {
    try {
        const { enroll_user_id } = req.params
        if (!enroll_user_id) {
            return res.status(400).json({
                success: false,
                message: 'Enroll User Id Required'
            })
        }
        
        // check for enroll user 
        const enroll_user = await courses_user_enroll_Model.findOne({ _id: enroll_user_id })
        if (!enroll_user) {
            return res.status(400).json({
                success: false,
                message: 'Enroll User Not Found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Enroll User Details',
            detail: {
                first_name: enroll_user.first_name,
                last_name: enroll_user.last_name,
                email: enroll_user.email,
                password: enroll_user.password,
                phone_no: enroll_user.phone_no,
                status: enroll_user.status,
                profileImage: enroll_user.profileImage
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        })
    }
}


// Api for get average of the user test of the particular course
const generate_avg_score_of_enroll_user = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // Check for required fields
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        // Fetch user quiz records for the specified course and user
        const check_last_topic_status = await user_enrolled_course_toic_manage_Model.find({
            enroll_user_id: user_id,
            course_id: course_id,
        });

        if (check_last_topic_status.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No topic records found for the given user and course',
            });
        }

        // Get the last index of the topic array
        const lastIndex = check_last_topic_status[0].topic.length - 1;

        // Check the status of the last topic
        if (check_last_topic_status[0].topic[lastIndex].topic_status !== 2) {
            return res.status(400).json({
                success: false,
                message: 'You did not pass the quiz; your score is below 80. Please try again.'
            });
        }

        // Fetch user quiz records for the specified course and user
        const userResponses = await user_enrolled_course_toic_quiz_manage_Model.find({
            enroll_user_id: user_id,
            course_id: course_id,
        });

        // Check if there are any records
        if (userResponses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No quiz records found for the given user and course',
            });
        }

        // Calculate the average score for all quizzes
        const totalMarks = userResponses.reduce((sum, response) => sum + parseInt(response.answer_percent), 0);
        const averageMarks = totalMarks / userResponses.length;

        // Return the calculated average marks
        return res.status(200).json({
            success: true,
            message: `Congratulations on successfully completing the course! You can now download your certificate.`,
            average_marks: parseInt(averageMarks),

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};





// Api for download certificate


const download_certificate = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // check for required field
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Enroll User Id Required'
            });
        }
               
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'course_id Required'
            });
        }
             
        // check for user
        const user = await courses_user_enroll_Model.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Enroll User not found'
            });
        } 
        
        // check for the course
        const course = await user_enrolled_course_toic_manage_Model.findOne({ enroll_user_id : user_id, course_id: course_id });
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'course not found for the user'
            });
        }
               
        const course_start_time = course.createdAt;
        const course_end_time = course.updatedAt;

        const startTime = new Date(course_start_time);
        const endTime = new Date(course_end_time);

        // Calculate the time difference in milliseconds 
        const timeDifference = endTime - startTime;

        // Convert milliseconds to days
        const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        const option = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = startTime.toLocaleDateString('en-US', option);

        // Prepare the HTML content for the PDF
        const htmlContent = `
                    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Roboto', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f7f7f7;">

    <div style="width: 800px; padding: 40px; border: 5px solid #f2f2f2; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); background-color: white; position: relative; overflow: hidden;">
        
        <!-- Left border with blue and yellow -->
        <div style="position: absolute; top: 0; left: 0; height: 100%; width: 20px; background: linear-gradient(to bottom, #C89B3C 0%, #C89B3C 80%, #002C8B 80%, #002C8B 100%);"></div>
        
        <!-- Bottom right squares -->
        <div style="position: absolute; bottom: 40px; right: 40px; width: 50px; height: 50px; background-color: #002C8B;"></div>
        <div style="position: absolute; bottom: 25px; right: 25px; width: 30px; height: 30px; background-color: #C89B3C; z-index: -1;"></div>

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="width: 150px;">
                <img src="http://itdevelopmentservices.com/hrsolution/static/media/logo.f2c7bc8da87c4d436402.png" alt="Smart Start Logo" style="width: 100%;">
            </div>
            <div>
                <p style="font-size: 14px; color: #707070; font-style: italic;">...Professionalism Defined</p>
            </div>
        </div>

        <!-- Title -->
        <h1 style="text-align: center; font-size: 36px; margin-top: 20px; color: #333;">Certificate of Completion</h1>
        <p style="text-align: center; font-size: 18px; color: #b0b0b0; margin-top: 10px;">This is to certify that</p>

        <!-- Name -->
        <h2 style="text-align: center; font-size: 40px; font-weight: 700; margin-top: 10px; color: #333;">${user.first_name}${user.last_name}</h2>

        <!-- Course Details -->
        <p style="text-align: center; font-size: 16px; margin: 20px 0; color: #707070; line-height: 1.6;">
            Has successfully completed the course <span style="font-weight: 700; color: #333;">${course.course_name}</span> comprising 
            <span style="font-weight: 700; color: #333;">${totalDays}</span> Days of study on 
            <span style="font-weight: 700; color: #333;">${formattedDate}</span> in recognition of the commitment to professional development through online learning.
        </p>

        <!-- Signature Section -->
        <div style="text-align: center; margin-top: 40px;">
            <p style="font-family: 'Great Vibes', cursive; font-size: 28px; color: #333;">Patricia Olayemi Jangah</p>
            <p style="font-size: 14px; color: #707070;">Lead Trainer</p>
        </div>

    </div>
</body>
</html>
                `;

        // Launch Puppeteer to generate the PDF
        const browser = await puppeteer.launch({ headless: true }); // Ensure headless mode 
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
            }
        });

        await browser.close();

        // Set response headers to download the PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=certificate.pdf`,
        });

        // Send the PDF to the client
        res.send(pdfBuffer);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};



const export_client_jobs_filteredcandidate = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const { from_date, to_date, gender, district, job_Type } = req.query;

        // Check for client ID
        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required',
            });
        }        
 
        // Check for client existence 
        const client = await employeeModel.findOne({ _id: client_id });
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client not found',
            });
        }
                       
        // Construct filter for applied job candidates 
        const filter = { };

        // Date range filter (checks `createdAt` in `appliedjobModel`) 
        if (from_date || to_date) {
            filter.createdAt = { };
            if (from_date) filter.createdAt.$gte = new Date(from_date);
            if (to_date) filter.createdAt.$lte = new Date(to_date);
        }

        // Gender filter
        if (gender) {
            filter.gender = gender;
        }


        // Construct regex-based filters for `district` and `job_Type` 
        if (district) {
            filter.city = { $regex: district, $options: 'i' };
        }
        if (job_Type) {
            filter.job_Heading = { $regex: job_Type, $options: 'i' };
        }

        // Fetch jobs posted by the client
        const totalJobs = await jobModel.find({ emp_Id: client_id });
        if (totalJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No jobs found for this client',
            });
        }

        // Fetch candidates applied for the jobs with combined filters
        const totalCandidates = await appliedjobModel.find({
            jobId: { $in: totalJobs.map(job => job.jobId) },
            ...filter,
        });
                
        if (totalCandidates.length === 0) {

            return res.status(400).json({
                success: false,
                message: `No candidates found for the jobs posted by this client`,
            });
        }
        else {

            // Create Excel workbook and worksheet

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet("Candidates");

            // Define Excel header
            worksheet.columns = [
                { header: "First Name", key: "first_Name", width: 15 },
                { header: "Last Name", key: "last_Name", width: 15 },
                { header: "User Email", key: "user_Email", width: 25 },
                { header: "District", key: "city", width: 15 },
                { header: "Phone Number", key: "phone_no", width: 15 },
                { header: "Status", key: "jobSeeker_status", width: 15 },
                { header: "Gender", key: "gender", width: 10 },
                { header: "Job Heading", key: "job_Heading", width: 20 },
                { header: "Job ID", key: "jobId", width: 10 },
                { header: "Highest Education", key: "Highest_Education", width: 20 },
                { header: "Total Experience", key: "Total_experience", width: 15 },
                { header: "CV", key: "uploadResume", width: 25 },
                { header: "Candidate Rating", key: "candidate_rating", width: 15 },
            ];
               
            // Add data to the worksheet
            totalCandidates.forEach(candidate => {
                worksheet.addRow({
                    first_Name: candidate.first_Name,
                    last_Name: candidate.last_Name,
                    user_Email: candidate.user_Email,
                    city: candidate.city,
                    phone_no: candidate.phone_no,
                    jobSeeker_status: candidate.jobSeeker_status,
                    gender: candidate.gender,
                    job_Heading: candidate.job_Heading,
                    jobId: candidate.jobId,
                    Highest_Education: candidate.Highest_Education,
                    Total_experience: candidate.Total_experience,
                    uploadResume: candidate.uploadResume,
                    candidate_rating: candidate.candidate_rating,
                });
            });
               

            // Set response headers for downloading the Excel file
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${gender || 'all'}_candidates.xlsx`
            );

            // Generate and send the Excel file as a response
            await workbook.xlsx.write(res); 

            // End the response
            res.end();
        }


    } catch (error) {
        console.error("Error exporting candidates:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};

// Api for download Jd in word


// const download_word_Jd = async (req, res) => {
//     try {
//         const jd_id = req.params.jd_id;
//         const jd_download_count = req.query.jd_download_count

//         if (!jd_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Job ID required',
//             });
//         }
              
//         const jd = await jobDescription_model.findById(jd_id);
//         if (!jd) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Job Description not found',
//             });
//         }


//         jd.jd_download_count = jd_download_count
//         await jd.save()
    

//             const { jobTitle, job_Description, Responsibilities } = jd;

//             // Convert HTML content to plain text
//             const plainJobDescription = convert(job_Description || '', { wordwrap: false });
//             const plainResponsibilities = convert(Responsibilities || '', { wordwrap: false });


            

//             const doc = new Document({
//                 sections: [
//                     {
//                         children: [
//                             // Job Title
//                             new Paragraph({
//                                 children: [
//                                     new TextRun({
//                                         text: jobTitle,
//                                         bold: true,
//                                         size: 32,
//                                         color: "0078d7", 
//                                     }),
//                                 ],
                                                                                
//                                 spacing: { after: 200 },
//                             }),

//                             // Job Description Heading
//                             new Paragraph({
//                                 children: [
//                                     new TextRun({
//                                         text: 'Job Description',
//                                         bold: true,
//                                         size: 28,
//                                     }),
//                                 ],
//                                 spacing: { after: 100 },
//                             }),

        
        
//                             // Job Description Content
//                             new Paragraph({
//                                 children: [
//                                     new TextRun({
//                                         text: job_Description,
//                                         size: 24,
//                                     }),
//                                 ],
//                                 spacing: { after: 200 },
//                             }),
        
//                             // Job Responsibilities Heading
//                             new Paragraph({
//                                 children: [
//                                     new TextRun({
//                                         text: 'Job Responsibilities',
//                                         bold: true,
//                                         size: 28,
//                                     }),
//                                 ],
//                                 spacing: { after: 100 },
//                             }),
        
//                             // Job Responsibilities Content
//                             ...Responsibilities.split('\n').map(responsibility =>
//                                 new Paragraph({
//                                     children: [new TextRun({ text: `• ${responsibility}`, size: 24 })],
//                                 })
//                             ),
//                         ],
//                     },
//                 ],
//             });
        
//             // Generate the Word document as a buffer
//             const buffer = await Packer.toBuffer(doc);
        
//             // Set response headers
//             res.set({
//                 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//                 'Content-Disposition': `attachment; filename=job_description.docx`,
//             });
        
//             res.send(buffer);
//         }
//         catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error_message: error.message,
//         });
//     }
// };



const sanitizeHtml = require('sanitize-html');

const htmlDocx = require("html-docx-js");
// const jobDescription_model2 = require('../model/jobDescription2')



const download_word_Jd = async (req, res) => {
    try {
        const jd_id = req.params.jd_id;
        const jd_download_count = req.query.jd_download_count;

        if (!jd_id) {
            return res.status(400).json({
                success: false,
                message: 'Job ID required',
            });
        }

        const jd = await jobDescription_model.findById(jd_id);
        if (!jd) {
            return res.status(400).json({
                success: false,
                message: 'Job Description not found',
            });
        }

        jd.jd_download_count = jd_download_count;
        await jd.save();

        // Dynamic content: HTML content comes from the database with inline styles
        let jobDescriptionContent = jd.job_Description;

        // Sanitize HTML content while preserving all inline styles
        const sanitizedHtml = sanitizeHtml(jobDescriptionContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'div']),
            allowedAttributes: {
                '*': ['style', 'class', 'id', 'href', 'src', 'alt']
            },
            allowedStyles: {
                '*': {
                    'font-family': [/^.*$/],
                    'font-size': [/^.*$/],
                    'color': [/^.*$/],
                    'background-color': [/^.*$/],
                    'font-weight': [/^.*$/],
                    'font-style': [/^.*$/],
                    'text-decoration': [/^.*$/],
                    'text-align': [/^.*$/]
                }
            }
        });

        // Generate HTML content for JD with preserved styles
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>HR Solution</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: Calibri;
                        font-size: 10.5pt;
                        color: #000;
                    }
                    @media print {
                        .page-break { page-break-before: always; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    }
                </style>
            </head>

            <body>
                <div style="margin-bottom: 20px;">
                    ${sanitizedHtml}
                </div>

                <tr style="height: 37mm; vertical-align: bottom;">
                    <td colspan="2" style="padding: 0; margin: 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="width: 100%; text-align: center;"></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-right: 90px; color: #000; font-size: 10.5pt; font-weight: normal; letter-spacing: 0.5px;">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </body>
            </html>
        `;

        // Convert HTML to DOCX
        const docxBuffer = htmlDocx.asBlob(htmlContent);

        res.setHeader('Content-Disposition', 'attachment; filename=job_description.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.write(Buffer.from(await docxBuffer.arrayBuffer()));
        res.end();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// const download_word_Jd = async (req, res) => {
//     try {
//         const jd_id = req.params.jd_id;
//         const jd_download_count = req.query.jd_download_count;

//         if (!jd_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Job ID required',
//             });
//         }

//         const jd = await jobDescription_model.findById(jd_id);
//         if (!jd) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Job Description not found',
//             });
//         }

//         jd.jd_download_count = jd_download_count;
//         await jd.save();

//         // HTML content without Job Description & Responsibilities
//         const htmlInput = `
//             <div>
//                 <h1>${jd.jobTitle}</h1>
//             </div>
//         `;

//         // Generate the final HTML content
//         const htmlContent = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>HR Solution</title>
//             <style>
//                 @media print {
//                     .page-break { page-break-before: always; }
//                     thead { display: table-header-group; }
//                     tfoot { display: table-footer-group; }
//                 }
//             </style>
//         </head>
//         <body style="margin: 0; padding: 0; box-sizing: border-box; color: #666; font-family: 'Roboto';">
//             <table style="width: 210mm; height: 297mm; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;
//             box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
//                 <!-- Header Section -->
//                 <tr style="height:20mm;">
//                     <td colspan="2" style="padding: 30px 90px 15px; opacity: 0.4;">
//                         <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #dbb85c;">
//                             <tr style="vertical-align: bottom;">
//                                 <td style="width: 50%; padding-bottom: 15px;">
//                                     <img src="https://itdevelopmentservices.com/hrsolution/static/media/logo.f2c7bc8da87c4d436402.png"
//                                         alt="Logo" width="160" height="80">
//                                 </td>
//                                 <td style="width: 50%; padding-bottom: 15px;">
//                                     <table>
//                                         <tr>
//                                             <td style="font-size: 13px;font-weight: 600;color: #dbb85c;vertical-align: baseline;">
//                                                 +232 (88) 353535 <br> +232 (77) 065 065
//                                             </td>
//                                             <td style="font-size: 13px;font-weight: 600;color: #020951;text-align: left;padding-left: 25px;">
//                                                 1 Jangah Close, Main<br>Peninsular Road, <br>Freetown, Sierra Leone
//                                             </td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>

//                 <!-- Body Section -->
//                 <tr style="height:230mm;">
//                     <td colspan="2"
//                         style="background-image: url(https://sisccltd.com/hrsolutions/bg.png); background-repeat: no-repeat; background-position: center; background-size: contain; background-color: #ffffffeb; background-blend-mode: overlay; height: 100%; padding: 30px 90px; vertical-align: baseline;">
//                         <h5> ${htmlInput} </h5>
//                     </td>
//                 </tr>

//                 <!-- Footer Section -->
//                 <tr style="height: 37mm; vertical-align: bottom;">
//                     <td colspan="2" style="padding: 0; margin: 0;">
//                         <table style="width: 100%; border-collapse: collapse;">
//                             <tr>
//                                 <td style="width: 100%; text-align: center;">
//                                     <img src="https://sisccltd.com/hrsolutions/footer12.png" 
//                                         alt="Footer Image" 
//                                         width="800" 
//                                         height="auto" 
//                                         style="max-width: 100%;  object-fit: cover;">
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="text-align: right; padding-right: 90px; color: #fff; 
//                                         font-size: 13px; line-height: 18px; font-weight: 600; 
//                                         letter-spacing: 0.5px;">
//                                     Professionalism<br>Defined...
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>
//             </table>
//         </body>
//         </html>               
//         `;

//         // Convert HTML to DOCX
//         const docxBuffer = htmlDocx.asBlob(htmlContent);

//         res.setHeader('Content-Disposition', 'attachment; filename=job_description.docx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

//         // Ensure proper buffer handling
//         res.write(Buffer.from(await docxBuffer.arrayBuffer()));
//         res.end();

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error_message: error.message,
//         });
//     }
// };



 let all_package_transaction = async (req, res) => {
    try {
        const { payment_status } = req.query;

        // Default filter: Exclude 'STATE_PENDING' transactions
        let filter = { payment_status: { $ne: 'STATE_PENDING' } };

        // Apply specific filters based on payment_status value 
        if (payment_status === '1') {
            filter.payment_status = 'STATE_COMPLETED';
        } else if (payment_status === '2') {
            filter.payment_status = 'STATE_FAILED';
        }

        // Fetch all package transactions based on the filter
        let all_transactions = await package_transaction_model
            .find(filter)
            .sort({ createdAt : -1 })
            .lean();
    
        if (!all_transactions || all_transactions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No Transaction Found',
            });
        }           

        // Map and format the transactions
        return res.status(200).json({
            success: true,
            message: 'All Package Transaction',
            all_transactions: all_transactions.map((t) => ({
                booking_id: t.booking_id,
                package_id: t.package_id,
                client_id: t.client_id,
                package_name: t.package_name,
                client_name: t.client_name,
                company: t.company,
                amount: t.amount,
                payment_status: t.payment_status,
                transaction_id: t.session_id,
                payment_time: t.payment_time,
                kind: t.kind,
                payment_info: t.payment_info,
                currency: t.currency,
            })),
        });
               
    } catch (error) {
        return res.status(500).json({   
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};

const axios = require("axios")
const officeToPdf = require("office-to-pdf");
 


const ConvertAPI = require("convertapi");

const convertWordToPdf = async (wordFilePath) => {
    try {
        const convertapi = new ConvertAPI(process.env.CONVERTAPI_KEY);

        const pdfFilePath = wordFilePath.replace(".docx", ".pdf");

        // Convert DOCX to PDF
        const result = await convertapi.convert(
            "pdf", 
            { File: wordFilePath },
            "docx"
        );

        // Save the converted file
        await result.file.save(pdfFilePath);

        console.log(`PDF saved at: ${pdfFilePath}`);
        return pdfFilePath;
    } catch (error) {
        console.error("ConvertAPI Error:", error.message);
        throw new Error("PDF conversion failed.");
    }
};

const uploadJobFile = async (req, res) => {
    try {
        const { jobTitleId } = req.params;

        // 1. Validate jobTitleId and file
        if (!jobTitleId || !req.file) {
            return res.status(400).json({ message: "Job ID and Word (.docx) file are required." });
        }

        // 2. Check file type
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (ext !== ".docx") {
            // Delete the invalid file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Only .docx files are allowed." });
        }

        // 3. Check if job title exists
        const jobTitle = await main_jobTitleModel.findById(jobTitleId);
        if (!jobTitle) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Job title not found." });
        }

        // 4. Ensure uploads folder exists
        const uploadsDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // 5. Move the file to uploads and rename
        const wordFileName = `job_${Date.now()}.docx`;
        const finalPath = path.join(uploadsDir, wordFileName);
        fs.renameSync(req.file.path, finalPath);

        // 6. Save to MongoDB
        const newJobDescription = new jobDescription_model2({
            jobTitleId,
            jobTitle: jobTitle.Main_jobTitle,
            jobWord: wordFileName,
        });

        await newJobDescription.save();

        res.status(201).json({
            success: true,
            message: "Word file uploaded and saved successfully.",
            data: newJobDescription,
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const { exec } = require("child_process");


// const convertWordToPdf = async (wordFilePath) => {
//     return new Promise((resolve, reject) => {
//         const pdfFilePath = wordFilePath.replace(".docx", ".pdf");

//         // Full path to xelatex for Windows
//         const xelatexPath = `"C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\xelatex.exe"`;

//         exec(`pandoc "${wordFilePath}" -o "${pdfFilePath}" --pdf-engine=${xelatexPath}`, 
//         (error, stdout, stderr) => {
//             if (error) {
//                 console.error("Pandoc Error:", stderr || error.message);
//                 return reject(new Error("PDF conversion failed."));
//             }
//             console.log("Pandoc Output:", stdout);
//             resolve(pdfFilePath);
//         });
//     });
// };


// const uploadJobFile = async (req, res) => {
//     try {
//         const { jobTitleId } = req.params;
//         if (!jobTitleId || !req.file) {
//             return res.status(400).json({ message: "Job ID and Word file are required." });
//         }

//         const jobTitle = await main_jobTitleModel.findOne({ _id: jobTitleId });
//         if (!jobTitle) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Job title not found",
//             });
//         }

//         // Ensure "uploads" directory exists
//         const uploadsDir = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         // Move Word file to uploads folder
//         const tempWordFilePath = req.file.path;
//         const wordFileName = `job_${Date.now()}.docx`;
//         const wordFilePath = path.join(uploadsDir, wordFileName);
//         fs.renameSync(tempWordFilePath, wordFilePath);

//         // Convert Word to PDF using Pandoc
//         const pdfFilePath = await convertWordToPdf(wordFilePath);
//         const pdfFileName = path.basename(pdfFilePath);

//         // Save both files in MongoDBss
//         const newJobDescription = new jobDescription_model2({
//             jobTitleId,
//             jobTitle: jobTitle.Main_jobTitle,
//             jobWord: wordFileName,
//             jobPdf: pdfFileName,
//         });
//         console.log("khks")

//         await newJobDescription.save();

//         res.status(201).json({
//             success: true,
//             message: "Word file uploaded and converted to PDF successfully",
//             data: newJobDescription,
//         });

//     } catch (error) {
//         console.error("Error:", error.message);
//         res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };

const libreOfficeCmd = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;

// const convertWordToPdf = async (wordFilePath, outputDir) => {
//     return new Promise((resolve, reject) => {
//         const pdfFilePath = path.join(outputDir, path.basename(wordFilePath, ".docx") + ".pdf");
//         const command = `soffice --headless --convert-to pdf "${wordFilePath}" --outdir "${outputDir}"`;

//         exec(command, (error, stdout, stderr) => {
//             if (error) {
//                 console.error("LibreOffice Conversion Error:", stderr || error.message);
//                 return reject(`LibreOffice conversion failed: ${stderr || error.message}`);
//             }

//             if (!fs.existsSync(pdfFilePath)) {
//                 return reject("PDF file was not created. Conversion may have failed.");
//             }

//             resolve(pdfFilePath);
//         });
//     });
// };


// const uploadJobFile = async (req, res) => {
//     try {
//         const { jobTitleId } = req.params;

//         if (!jobTitleId || !req.file) {
//             return res.status(400).json({ message: "Job ID and Word file are required." });
//         }

//         const jobTitle = await main_jobTitleModel.findOne({ _id: jobTitleId });
//         if (!jobTitle) {
//             return res.status(400).json({ success: false, message: "Job title not found" });
//         }

//         // Ensure "uploads" directory exists
//         const uploadsDir = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         // Move Word file to uploads folder
//         const tempWordFilePath = req.file.path;
//         const wordFileName = `job_${Date.now()}.docx`;
//         const wordFilePath = path.join(uploadsDir, wordFileName);
//         fs.renameSync(tempWordFilePath, wordFilePath);

//         // Convert Word to PDF using Pandoc
//         const pdfFilePath = await convertWordToPdf(wordFilePath, uploadsDir);

//         // Save both files in MongoDB
//         const newJobDescription = new jobDescription_model2({
//             jobTitleId,
//             jobTitle: jobTitle.Main_jobTitle,
//             jobWord: wordFileName,
//             jobPdf: path.basename(pdfFilePath),
//         });

//         await newJobDescription.save();

//         res.status(201).json({
//             success: true,
//             message: "Word file uploaded and converted to PDF successfully",
//             data: newJobDescription,
//         });

//     } catch (error) {
//         console.error("Error:", error.message);
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };


const getAllUploadedJobFiles = async(req,res)=>{
    try {
        const uploadedFiles = await jobDescription_model2.find()
        if(!uploadedFiles.length ===0){
            return res.status(200).json({
                success : false,
                message : "No any uploaded job files found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "All uploaded job files retrieved successfully",
            data : uploadedFiles
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message
        })
    }
}

const updateJobCountById = async (req, res) => {
    try {
        const { id } = req.params;  // Get job description _id from URL
        const { count } = req.body; // Get count from request body

        if (!count) {
            return res.status(400).json({ success : false,message: "Count is required." });
        }

        // Find and update the count field
        const updatedJob = await jobDescription_model2.findByIdAndUpdate(
            id,
            { count },
            { new: true } // Return updated document
        );

        if (!updatedJob) {
            return res.status(404).json({success : false, message: "Job description not found." });
        }

        res.status(200).json({
            success : true,
            message: "Count updated successfully",
            data: updatedJob
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({success : false, message: "Internal Server Error", error: error.message });
    }
};

const deleteJobDescriptionById = async (req, res) => {
    try {
        const { id } = req.params; // Get _id from URL

        // Find and delete the document
        const deletedJob = await jobDescription_model2.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ message: "Job description not found." });
        }

        res.status(200).json({
            success : true,
            message: "Job description deleted successfully",
            data: deletedJob
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({success : false, message: "Internal Server Error", error: error.message });
    }
};

// const uploadJobFile = async (req, res) => {
//     try {
//         const { jobTitleId } = req.params;

//         if (!jobTitleId || !req.file) {
//             return res.status(400).json({ message: "Job ID and Word file are required." });
//         }
//         const jobTitle = await main_jobTitleModel.findOne({_id : jobTitleId})
//         if(!jobTitle){
//             return res.status(400).json({
//                 success : false,
//                 message : "Job title not found"
//             })
//         }

//         // Ensure "uploads" directory exists
//         const uploadsDir = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         // Get uploaded Word file
//         const tempWordFilePath = req.file.path; // Temporary location from multer
//         const wordFileName = `job_${Date.now()}.docx`; // Rename to avoid conflicts
//         const wordFilePath = path.join(uploadsDir, wordFileName); 

//         // Move Word file to uploads folder
//         fs.renameSync(tempWordFilePath, wordFilePath);

//         // Define PDF filename and path
//         const pdfFileName = `job_${Date.now()}.pdf`;
//         const pdfFilePath = path.join(uploadsDir, pdfFileName);

//         // Convert Word to PDF
//         const wordBuffer = fs.readFileSync(wordFilePath);
//         const pdfBuffer = await officeToPdf(wordBuffer);

//         if (!pdfBuffer) {
//             return res.status(500).json({ message: "PDF conversion failed." });
//         }

//         // Save PDF to disk
//         fs.writeFileSync(pdfFilePath, pdfBuffer);


//         // Save both files in MongoDB
//         const newJobDescription = new jobDescription_model2({
//             jobTitleId,
//             jobTitle : jobTitle.Main_jobTitle,
//             jobWord: wordFileName, // Save only filename
//             jobPdf: pdfFileName,   // Save only filename
//         });

//         await newJobDescription.save();

//         res.status(201).json({
//             success : true,
//             message: "Word file uploaded and converted to PDF successfully",
//             data : newJobDescription
//         });

//     } catch (error) {
//         console.error("Error:", error.message);
//         res.status(500).json({ success : false ,message: "Internal Server Error", error: error.message });
//     }
// };

/* const uploadJobFile = async (req, res) => {
    try {
        const { jobTitleId } = req.params;

        if (!jobTitleId || !req.file) {
            return res.status(400).json({ message: "Job ID and Word file are required." });
        }

        const jobTitle = await main_jobTitleModel.findOne({ _id: jobTitleId });
        if (!jobTitle) {
            return res.status(400).json({
                success: false,
                message: "Job title not found",
            });
        }

        const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log("Uploads directory exists:", fs.existsSync(uploadsDir)); // Debugging


        const wordFileName = `job_${Date.now()}.docx`;
        const wordFilePath = path.join(uploadsDir, wordFileName);
        fs.renameSync(req.file.path, wordFilePath);

        const pdfFileName = `job_${Date.now()}.pdf`;
        const pdfFilePath = path.join(uploadsDir, pdfFileName);

        // Convert Word to PDF using LibreOffice
        await new Promise((resolve, reject) => {
            exec(`soffice --headless --convert-to pdf "${wordFilePath}" --outdir "${uploadsDir}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Conversion Error: ${stderr}`);
                    return reject(new Error("PDF conversion failed."));
                }
                resolve();
            });
        });

        // Save both files in MongoDB
        const newJobDescription = new jobDescription_model2({
            jobTitleId,
            jobTitle: jobTitle.Main_jobTitle,
            jobWord: wordFileName,
            jobPdf: pdfFileName,
        });

        await newJobDescription.save();

        res.status(201).json({
            success: true,
            message: "Word file uploaded and converted to PDF successfully",
            data: newJobDescription,
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}; */

module.exports = {
    employeeSignup, 
    Emp_login, getEmployeeDetails, updateEmp, emp_ChangePassword, postJob, getJobs_posted_by_employee,
    getAll_Jobs, searchJob, apply_on_job, get_Female_jobseeker_profile, get_jobseeker_profile, getNotification_emp,
    seenNotification, unseenNotificationCount, deleteJob, activejobs_by_client, Inactivejobs_by_client, filterJob,
    getServices_of_smart_start, get_privacy_policy, get__admin_term_condition, dashboard_counts, deleteCandidate,
    cms_getJobs_posted_procedure_section1, cms_get_need_any_job_section, get_cms_post_your_job, cms_getjob_market_data,
    addJobTitle, alljobTitle, deletejobTitle, export_candidate, client_dashboardCount,
    forgetPassOTP, verifyOTP, clientResetPass, create_contactUS, getJob, addJob_Description, alljobDescription,
    deleteJob_Description, getJd, fixit_finder, uploadResume, get_upload_section_candidates,
    candidate_recruitment_process_for_uploaded_candidate, get_successfull_candidate, all_active_jobs_Count_with_title,
    blog_section_comment, get_all__blog_section_comments, updateJob, download_jd, share_cv, save_candidate_profile_for_later,
    get_saved_candidate_profile, update_candidate_rating, get_female_candidate_for_client, get_male_candidate_for_client,
    build_cv, get_all_candidate_for_client, export_client_jobs_candidate,

    // Psychometric 

    add_test_Category, getAll_psychometric_Category, Delete_category, 

    psychometric_test, getAll_psychometric_test_of_client,
    get_test, add_question_in_test, delete_question_in_psychometric_test, deletepsychometrcTest,
    courses_user_enroll, all_enrolled_user, enrolled_user_login, enroll_course, update_course_status,
    get_my_enrolled_courses, get_enrolled_users_count, topic_quiz,
    update_topic_status, enroll_user_course_topic_quiz, save_user_quiz_record_of_course_topic,
    get_particular_enrolled_course_details, get_enrolled_user_detail, generate_avg_score_of_enroll_user,

    download_certificate, export_client_jobs_filteredcandidate , download_word_Jd, 

    add_Main_JobTitle, all_main_jobTitle, delete_main_jobTitle , all_package_transaction, update_detail ,

    

    // Admin API

    getAll_Jobs_admin , all_main_jobTitle_main  ,uploadJobFile,updateJobCountById ,getAllUploadedJobFiles ,deleteJobDescriptionById,
    clientSignup ,getAllClients
} 

