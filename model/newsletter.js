const mongoose = require('mongoose')
const cms_newsletter_Schema = new mongoose.Schema({
             email : {
                 type : String
             },
             status : {
                type : Number ,
                enum : [0,1],
                default : 1
             }

}, {timestamps : true })

const cms_newsletter_Model = mongoose.model('newsLetter', cms_newsletter_Schema)

module.exports = cms_newsletter_Model