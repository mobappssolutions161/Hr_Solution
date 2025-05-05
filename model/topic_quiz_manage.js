const mongoose = require('mongoose')
const user_enrolled_course_toic_quiz_manage_Schema = new mongoose.Schema({
         
         enroll_user_id : {
               type : mongoose.Schema.Types.ObjectId,
               ref : 'courses_user_enroll_Model'
         },
         course_id : {
              type : mongoose.Schema.Types.ObjectId,
               ref : 'cms_online_courses_Model'
         },
            
          course_name : {
                type : String
          },

           topic_name : {
               type : String
           },
           topic_id : {
               type : mongoose.Schema.Types.ObjectId,
               ref : 'cms_online_courses_Model'
           },

           questions_Bank : [{
            question : {
                 type : String
            },
            options: [{
                option_name : String,
                
            }],
            correct_answer : {
                 type : String
                        },
                
            user_answer : {
                     type : String,
                     default : ''
            }
            
            
                }],
            
                answer_percent : {
                   type : String,
                   default : ''

            }        
            
          
}, { timestamps : true })

   const user_enrolled_course_toic_quiz_manage_Model = mongoose.model('user_enrolled_course_toic_quiz_manage', user_enrolled_course_toic_quiz_manage_Schema)

   module.exports = user_enrolled_course_toic_quiz_manage_Model
