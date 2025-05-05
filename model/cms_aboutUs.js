const mongoose = require('mongoose')
const cms_aboutUsSchema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_aboutUs_Model = mongoose.model('cms_aboutUsSchema', cms_aboutUsSchema)

module.exports = cms_aboutUs_Model