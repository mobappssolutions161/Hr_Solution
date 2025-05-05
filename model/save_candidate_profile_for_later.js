const mongoose = require('mongoose')
const save_candidate_profile_for_later_Schema = new mongoose.Schema({
       
         candidate_id : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'appliedjobmodel'
         },
           client_id : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'employee',


           },

         status : {
             type : Number,
             enum : [ 0 , 1 ],
             default : 1
         }
           
}, { timestamps : true })

const save_candidate_profile = mongoose.model('save_for_later', save_candidate_profile_for_later_Schema)

module.exports = save_candidate_profile