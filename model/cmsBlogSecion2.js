const mongoose = require('mongoose')
const cmsBlogsectiontwo = new mongoose.Schema({
       
           AdminId : {
                 type : mongoose.Schema.Types.ObjectId,
                 ref : 'Admin_and_staffsModel'
           },
           name  : {
                 type : String
           },
           Heading : {
              type : String
           },
           Description : {
             type : String
           },
           photo : {
              type : String
           },
           comment : {
                 type : String
           }
},
   {timestamps : true })

const cmsBlogsection2Model = mongoose.model('cmsBlog_section2', cmsBlogsectiontwo)

module.exports = cmsBlogsection2Model