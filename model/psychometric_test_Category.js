const mongoose = require('mongoose')
const psychometric_test_Category_Schema = new mongoose.Schema({
           
         category_name : {
              type : String
         }
   
}, { timestamps: true });



const psychometric_test_Category_Model = mongoose.model('psychometric_test_Category', psychometric_test_Category_Schema);

module.exports = psychometric_test_Category_Model;