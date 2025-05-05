const mongoose = require('mongoose')
const cms_our_vissionSchema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_our_vission_Model = mongoose.model('cms_our_vission', cms_our_vissionSchema)

module.exports = cms_our_vission_Model