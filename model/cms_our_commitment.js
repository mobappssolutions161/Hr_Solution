const mongoose = require('mongoose')
const cms_our_commitment_Schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_our_commitment_Model = mongoose.model('cms_our_commitment', cms_our_commitment_Schema)

module.exports = cms_our_commitment_Model