const mongoose = require('mongoose')
const clientPackageSchema = new mongoose.Schema({
       
           package_name : {
                type : String
           },
           features : {
                  type : String
           },
           price : {
                type : String
           },

           duration : {
                  type :  String
           },
           valid_days : {
                   type : Number
           },

           price_with_gst :{
                   type : String
           },
           package_type : {
                   type : String,
                   enum : ['Yearly' , 'Weekly']
           },
           access_portal : Number,

           status : {
                type : Number,
                enum : [1 ,0],
                default : 1
           }
}, { timestamps : true })

const clientPackageModel  = mongoose.model('client_package' , clientPackageSchema)

module.exports = clientPackageModel