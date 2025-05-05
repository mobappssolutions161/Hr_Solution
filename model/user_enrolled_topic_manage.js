const mongoose = require('mongoose')
const user_enrolled_course_toic_manage_Schema = new mongoose.Schema({
         
         enroll_user_id : {
               type : mongoose.Schema.Types.ObjectId,
               ref : 'courses_user_enroll_Model'
         },
            
          course_name : {
                type : String
          },

          course_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'cms_online_courses_Model'
          },

         
          topic : [{
            topic_name  : {
                 type : String
            },

            topic_description : {
                 type : String
            },

           files : {
                  type : [String]
           },
           
            topic_status : {
                 type : Number,
                 enum : [1 ,0 , 2],
                 default : 0
            },


}],
          
}, { timestamps : true })

   const user_enrolled_course_toic_manage_Model = mongoose.model('user_enrolled_course_toic_manage', user_enrolled_course_toic_manage_Schema)

   module.exports = user_enrolled_course_toic_manage_Model
