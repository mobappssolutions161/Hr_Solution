const mongoose = require('mongoose');

const Psychometric_test_Schema = new mongoose.Schema({
    client_id : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'empModel'
    },
    category_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'psychometric_test_Category_Model'
 },
    category_name : {
           type : String
    },

 questions_Bank : [{
               question : {
                    type : String
               },
               question_image : {
                    type : String 
               },
               options: [{
                   type: String,
                   
               }],
               correct_answer_index : {
                    type : Number ,
                    enum : [ 0 , 1 , 2 , 3 ]
               }
 }],

 status : {
        type : Number,
        enum : [ 1 , 0],
        default : 1
 }
}, { timestamps: true });

const Psychometric_test_Model = mongoose.model('Psychometric', Psychometric_test_Schema);

module.exports = Psychometric_test_Model;
