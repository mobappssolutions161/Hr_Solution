const mongoose = require('mongoose')
const cms_t_d_schema = new mongoose.Schema({
          

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

const cms_t_d_Model = mongoose.model('cms_training_developement', cms_t_d_schema)

module.exports = cms_t_d_Model