const mongoose = require('mongoose')
const contactUsSchema = new mongoose.Schema({

                name : {
                     type : String
                },
                email : {
                    type : String
                },
                phone_no : {
                     type : Number
                },
                subject : {
                    type : String
                },
                message : {
                     type : String
                }
}, {timestamps : true })

const contactUsModel = new mongoose.model('contactUs', contactUsSchema)

module.exports = contactUsModel