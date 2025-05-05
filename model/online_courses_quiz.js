const mongoose = require('mongoose')
const online_course_quiz_Schema = new mongoose.Schema({
            course_id : {
                   type : mongoose.Schema.Types.ObjectId,
                   ref : 'cms_online_courses_Model'
            },
            topic_id : {
                 type : mongoose.Schema.Types.ObjectId,
                   ref : 'cms_online_courses_Model'
            },

               course_name : {
                    type : String
               },
                    topic_name  : {
                         type : String
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
                                      }
            }],

            status : {
                   type : Number,
                   enum : [ 1 , 0],
                   default : 1
            }
}, { timestamps : true })

const online_course_quiz_Model = mongoose.model('online_course_quiz', online_course_quiz_Schema)

module.exports = online_course_quiz_Model