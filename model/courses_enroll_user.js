const mongoose = require('mongoose')
const courses_user_enroll_Schema = new mongoose.Schema({
        first_name : {
              type : String
        },
        last_name : {
              type : String
        },
        email : {
             type : String
        },
        password : {
               type : String
        },
        gender : {
              type : String,
              enum : ['Female' , 'Male' , 'Other']
        },


        phone_no : {
             type : Number
        }, 
          profileImage : String ,
        
        status : {
              type : Number,
              enum : [ 1, 0],
              default : 1
        },

          courses : [{
                        course_id : {
                              type : String
                        },
                        enroll_Date : {
                                 type : Date
                        },
                        status : {
                              type : String,
                              enum : ['Pending' , 'Accepted'],
                              default : 'Accepted'
                        }
          }]
        
       
}, { timestamps : true })

const courses_user_enroll_Model = mongoose.model('courses_user_enroll', courses_user_enroll_Schema)

module.exports = courses_user_enroll_Model