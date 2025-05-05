const mongoose = require('mongoose')
const cms_testimonialSchema = new mongoose.Schema({

                username : {
                    type : String
                },
                 user_image : {
                     type : String
                 },
                 title :  {
                     type : String
                 },
                 Description : {
                      type : String
                 }
}, {timestamps : true })

const cms_testimonialModel = mongoose.model('cms_testimonial', cms_testimonialSchema)
module.exports = cms_testimonialModel