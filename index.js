const express = require('express')
require('dotenv').config()
const app = express()
const Port = process.env.PORT || 4100
const cors = require('cors')
const bodyParser = require('body-parser')
const adminRouter = require('./router/adminRouter')
const userRouter = require('./router/userRouter')
const axios = require('axios')
const course_transaction_model = require('./model/transaction')
const employeeModel = require('./model/employeeModel')
const clientPackageModel = require('./model/clientPackage')
const cms_online_courses_Model = require('./model/cms_online_cources')
const courses_user_enroll_Model = require('./model/courses_enroll_user')
const permissionRouter = require('./router/permissionRouter')
const permissionSidebarRouter = require('./router/permissionSidebarRouter')


// database configuration
const db = require('./config/db')

// Middleware configuration
 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use(express.static('uploads'))
app.use(express.static('images'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
    });


// Router configuration

app.use('/api',  adminRouter)
app.use('/api', userRouter)
app.use('/api' , permissionRouter)
app.use('/api' , permissionSidebarRouter)

app.get('/', (req ,res)=>{
        res.send('Hello from HR Solutions Server')
})
app.get('/cancle', (req ,res)=>{
        res.send('Hello ')
})




                                    /*   Monime Payment Integration for both courses and packages */

        const PAYMENT_BASE_URL = 'https://api.monime.space/v1';
        const { Access_Token , Space_ID  } = process.env;
        const { v4: uuidv4 } = require('uuid');
        const crypto = require('crypto');
const { log } = require('console')
const package_transaction_model = require('./model/package_transaction')


         // Function to generate a random number
         function generateRandomNumber(length) {
          let result = '';
          const characters = '0123456789';
          const charactersLength = characters.length;

          for (let i = 0; i < length; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }

          return result;
      }


      
    
      const check_out_session_id = `scs-${generateRandomNumber(5)}`;
      const clientReference = `customer-${generateRandomNumber(6)}`  


        app.get('/api/create_checkOut_session' , async ( req , res )=> {
                
                   var {  cancelUrl , receiptUrl , total_amount , course_id , enroll_user_id } = req.query
                   var booking_id = `BKID${generateRandomNumber(5)}`;
                    //    const callbackUrlState = crypto.randomBytes(16).toString('hex')  
                   const callbackUrlState = `${generateRandomNumber(15)}`                  
                 
                  cancelUrl = `${cancelUrl}?sid=${check_out_session_id}$state=${callbackUrlState}$booking_id=${booking_id}$enroll_user_id=${enroll_user_id}$course_id=${course_id}`
                  receiptUrl = `${receiptUrl}?sid=${check_out_session_id}$state=${callbackUrlState}$booking_id=${booking_id}$enroll_user_id=${enroll_user_id}$course_id=${course_id}`
                                
                  
                  
             
                      total_amount = total_amount.replace(/[^0-9]/g, '')                           
               
                     const amountValue = total_amount * 100

                        try {
                          // Prepare the request payload
                          const payload = {
                              clientReference,
                              callbackUrlState,
                              bulk: {
                                  amount: {
                                      currency: 'SLE',
                                      value: amountValue
                                  }
                              },
                              cancelUrl,
                              receiptUrl
                          };
                  
                          // Make the API request
                          const response = await axios.post(`${PAYMENT_BASE_URL}/checkout-sessions`, payload, {
                              headers: {
                                  Authorization: `Bearer ${Access_Token}`,
                                  'X-Monime-Space-Id': Space_ID,
                                  'X-Idempotency-Key': `${clientReference}-${Date.now()}`
                              }
                          });
                  
                        const payment_response = response.data.result;

                                if(!course_id)
                                {
                                  return res.status(400).json({
                                       success : false ,
                                       message : 'Course Id Required'
                                  })
                                }
                                
                                if(!enroll_user_id)
                                  {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'Enroll user Id Required'
                                    })
                                  }
                                // check for course
                                  let course = await cms_online_courses_Model.findOne({ _id : course_id  })
                                  if(!course)
                                  {
                                    return res.status(400).json({
                                        success : false ,
                                        message : 'Enroll course Not Found'
                                    })
                                  }

                                  // check for Enroll USer
                                  let enroll_user = await courses_user_enroll_Model.findOne({ _id : enroll_user_id  })
                                  if(!enroll_user)
                                  {
                                    return res.status(400).json({
                                        success : false ,
                                        message : 'Enroll User Not Found'
                                    })
                                  }
                              
                      
                      
                        
                                const transaction = new course_transaction_model({
                                    booking_id : booking_id ,
                                    course_id : course._id  ,
                                    enroll_user_id :enroll_user._id ,
                                    course_name : course.Heading,
                                    user_name : `${enroll_user.first_name} ${enroll_user.last_name}`,
                                    amount : total_amount,
                                    payment_status : payment_response.status.state,
                                    session_id : payment_response.id,
                                    kind : payment_response.kind,
                                    payment_time : payment_response.status.stateTime,
                                    payment_info : {
                                            state : payment_response.paymentInfo.state,
                                            method : payment_response.paymentInfo.method,
                                            financialAccount : payment_response.paymentInfo.financialAccount
                                    },
                                    currency : payment_response.totalAmount.currency
            
                                })  
                            
                                await transaction.save()
                              
                                
                          res.status(200).json( {
                              success : true ,                            
                              checkoutUrl : payment_response.checkoutUrl,
                              status : payment_response.status.state,
                              cancelUrl : payment_response.cancelUrl,                           
                              receiptUrl : payment_response.receiptUrl,
                            
                          })
                        

                              } catch (error) {
                                  res.status(500).json({
                                      success : false ,
                                      message : 'Server Error',
                                      error_message : error.message
                                                  })
                              }
        })



        // Api for check status of payment
        app.get('/api/payment_status/:sessionId', async (req, res) => {
            const sessionId = req.params.sessionId;
            const url = `https://api.monime.space/v1/checkout-sessions/${sessionId}`;
            
            try {
              // Fetch the checkout session details from Monime API
              const response = await axios.get(url, {
                headers: {
                  'Authorization': `Bearer ${Access_Token}`,
                  'X-Monime-Space-Id': Space_ID
                }
              });
                      
                        
              // Ensure the response contains the checkoutSession object
              const sessionData = response.data.result;
              
              if (!sessionData) {
                return res.status(400).json({
                  success: false,
                  message: 'Checkout session not found.'
                });
              }
          
              // Extract session and payment status information
              const sessionStatus = sessionData.status ? sessionData.status.state : 'Unknown';
              const paymentStatus = sessionData.paymentInfo ? sessionData.paymentInfo.state : 'Unknown';
              const totalAmount = sessionData.totalAmount ? sessionData.totalAmount.value : 'Unknown';
          
              // Return a single response with session and payment status
              res.json({
                success: true,
                sessionId: sessionId,
                sessionStatus: sessionStatus,  
                paymentStatus: paymentStatus,  
                amount: totalAmount,
                message: `Session is ${sessionStatus} and payment is ${paymentStatus}`
              });
            } catch (error) {
              // Handle errors
              res.status(500).json({
                success: false,
                message: 'Failed to fetch session or payment status',
                error: error.message
              });
            }
          });


                                                  /*  for packages  */

          app.get('/api/create_checkOut_session_for_package' , async ( req , res )=> {

            var {  cancelUrl , receiptUrl , client_id , package_id  } = req.query
          
              //    const callbackUrlState = crypto.randomBytes(16).toString('hex')  
            const callbackUrlState = `${generateRandomNumber(15)}`                  
            const booking_id = `BKID${generateRandomNumber(5)}`;  
            
             // check for package
             let package = await clientPackageModel.findOne({
              _id : package_id
         })
         
            cancelUrl = `${cancelUrl}?sid=${check_out_session_id}$state=${callbackUrlState}$client_id=${client_id}$booking_id=${booking_id}`
            receiptUrl = `${receiptUrl}?sid=${check_out_session_id}$state=${callbackUrlState}$client_id=${client_id}$booking_id=${booking_id}`
  
            let total_amount = package.price
            
            total_amount = total_amount.replace(/[^0-9]/g, '') 

              const amountValue = total_amount * 100

                  try {
                    // Prepare the request payload
                    const payload = {
                        clientReference,
                        callbackUrlState,
                        bulk: {
                            amount: {
                                currency: 'SLE',
                                value: amountValue
                            }
                        },
                        cancelUrl,
                        receiptUrl
                    };
            
                    // Make the API request
                    const response = await axios.post(`${PAYMENT_BASE_URL}/checkout-sessions`, payload, {
                        headers: {
                            Authorization: `Bearer ${Access_Token}`,
                            'X-Monime-Space-Id': Space_ID,
                            'X-Idempotency-Key': `${clientReference}-${Date.now()}`
                        }
                    });
            
                  const payment_response = response.data.result;
      
                            // check for client 
                            let client = await employeeModel.findOne({
                              _id : client_id
                            })

                           
                                 
                  
                          const transaction = new package_transaction_model({
                              booking_id : booking_id ,
                              client_id : client_id,
                              package_id : package_id ,
                              client_name : client.name,
                              company : client.company_name,
                              package_name : package.package_name,
                              amount : total_amount,
                              payment_status : payment_response.status.state,
                              session_id : payment_response.id,
                              kind : payment_response.kind,
                              payment_time : payment_response.status.stateTime,
                              payment_info : {
                                      state : payment_response.paymentInfo.state,
                                      method : payment_response.paymentInfo.method,
                                      financialAccount : payment_response.paymentInfo.financialAccount
                              },
                              currency : payment_response.totalAmount.currency 
      
                          })  
                      
                          await transaction.save()
                        
                          
                    res.status(200).json({
                        success : true ,                            
                        checkoutUrl : payment_response.checkoutUrl,
                        status : payment_response.status.state,
                        cancelUrl : payment_response.cancelUrl,                      
                        receiptUrl : payment_response.receiptUrl,
                      
                    })
                  

                        } catch (error) {
                            res.status(500).json({
                                success : false ,
                                message : 'Server Error',
                                error_message : error.message
                                            })
                        }
                      })


                                 
app.listen(Port , ()=>{
       console.log(`Server is Running on PORT : ${Port}`);
})
