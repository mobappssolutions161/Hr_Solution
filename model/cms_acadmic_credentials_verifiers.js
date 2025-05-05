const mongoose = require('mongoose')
const cms_acadmic_credentials_verifier_Schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               },              
               Description1 : {
                    type : String
               },              
               image : {
                   type : String
               }
              

}, {timestamps : true })

const cms_acadmic_credentials_verifier_Model = mongoose.model('acadmic_credentials_verifier', cms_acadmic_credentials_verifier_Schema)

module.exports =  cms_acadmic_credentials_verifier_Model 