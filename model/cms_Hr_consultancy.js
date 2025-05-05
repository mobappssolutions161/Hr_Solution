const mongoose = require('mongoose')
const cms_hr_consultancy_Schema = new mongoose.Schema({
          

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
               },
               adminId : {
                      type : mongoose.Schema.Types.ObjectId,
                      ref : 'Admin_and_staffsModel'
               }

}, {timestamps : true })

const cms_hr_consultancy_Model = mongoose.model('cms_hr_consultancy', cms_hr_consultancy_Schema)

module.exports = cms_hr_consultancy_Model