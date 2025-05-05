const mongoose = require('mongoose')
const cms_why_choose_us_Schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_why_choose_us_Model = mongoose.model('why_choose_us', cms_why_choose_us_Schema)

module.exports = cms_why_choose_us_Model