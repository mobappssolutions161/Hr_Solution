const mongoose = require('mongoose')
const cms_home_Schema = new mongoose.Schema({
          

              
               Description : {
                    type : String
               }
              

}, {timestamps : true })

const cms_home_Model = mongoose.model('cms_home', cms_home_Schema)

module.exports = cms_home_Model