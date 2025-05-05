const mongoose = require('mongoose')
const cms_newsletter_Schema = new mongoose.Schema({
          

             email : {
                 type : String
             }

}, {timestamps : true })

const cms_newsletter_Model = mongoose.model('newsLetter', cms_newsletter_Schema)

module.exports = cms_newsletter_Model