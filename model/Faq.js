
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const faqSchema = new Schema({
  
   
    Question : {
        type : String,
        required : true
    },
      answer : {
        type : String,
        required  : true
    } 
      
      
} , { timestamps: true } )
const faqModel = mongoose.model('faqModel', faqSchema)

module.exports = faqModel