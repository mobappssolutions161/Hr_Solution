const mongoose = require('mongoose')
const cms_blogSectionOne = new mongoose.Schema({
           AdminId : {
                 type : mongoose.Schema.Types.ObjectId,
                 ref : 'Admin_and_staffsModel'
           },

           Heading : {
            type : String
           },

           Description : {
            type : String
           }
}, { timestamps : true })

const cms_Blogsection1Model = mongoose.model('cms_blog_section1', cms_blogSectionOne)

module.exports = cms_Blogsection1Model