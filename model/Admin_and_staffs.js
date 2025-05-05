const mongoose = require('mongoose')
const Admin_Schema = new mongoose.Schema({
     
       name : {
           type : String
       },
       email : {
          type : String
       },
       password : {
           type : String
       },
       phone_no : {
        type : Number
       },
       profileImage : {
        type : String
       },
       status : {
        type : Number,
        enum : [1,0]
       },
       role : {
        type : String,
        enum : ['HR Coordinator' , 'Super Admin']
    },
       staff_id :   String

}, { timestamps : true })

const Admin = mongoose.model('Admin_and_staffs', Admin_Schema)

module.exports = Admin