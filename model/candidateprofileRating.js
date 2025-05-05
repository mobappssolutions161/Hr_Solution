const mongoose = require('mongoose')
const candidate_cv_rating = new mongoose.Schema({
      candidate_id : {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'appliedjobModel'
       } ,

       cv :{
          type : String
       },
    rating : {
           type : Number
    },
     jobId : {
         type : String
     }  

}, { timestamps : true })

const candidate_cv_rating_Model = mongoose.model('candidate_cv_rating', candidate_cv_rating)

module.exports = candidate_cv_rating_Model

