const mongoose = require('mongoose')
const blog_section_comment_Schema = new mongoose.Schema({
     
             Name  : {
                   type : String
             },
             email : {
                 type : String
             },
             comment : {
                  type : String
             }
       
}, { timestamps : true })


const blog_section_comment_Model = mongoose.model('blog_section_comment', blog_section_comment_Schema)

module.exports = blog_section_comment_Model