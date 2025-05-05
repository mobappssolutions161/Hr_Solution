const mongoose = require('mongoose')
const emailTemplateSchema = new mongoose.Schema({
      
         email_title : {
               type : String
         },
          email_subject : {
                  type : String
          },
          email_body : {
               type : String
          },

          status : {
              type : Number,
              enum : [0 , 1],
              default : 1
          }
        
}, { timestamps : true })

const emailTemplateModel = mongoose.model('emailTemplate' , emailTemplateSchema)

module.exports = emailTemplateModel