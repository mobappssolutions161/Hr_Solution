const mongoose = require('mongoose')
const cms_get_started_today_schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_get_started_today_Model = mongoose.model('cms_get_started_today', cms_get_started_today_schema)

module.exports = cms_get_started_today_Model