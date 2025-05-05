const mongoose = require('mongoose')
const employeeSchema = new mongoose.Schema({
       
         name  : {
            type : String
         },
         email : {
            type : String
         },
         password : {
            type : String
         },
         phone_no :{
            type : Number
         },
         status : {
            type : Number,
            enum : [1, 0 , 2],
           
         },
         profileImage : {
            type : String
         },
         company_name : {
            type : String
         },
         Number_of_emp : {
            type : Number
         },
         company_industry : {
            type : String,
            // enum : ['Aerospace & Defense', 'Agriculture' , 'Information Technology' ,'Non-profit & NGO' , 'Real Estate' ,'Resturant & Food Services' , 'Marketing' , 'Finance' , 'others']
         },
         company_HQ : {
                type : String
         },
         package_id : {
               type : mongoose.Schema.Types.ObjectId
         },
         package_name : {
               type : String
         },
         package_type : String,
         plain_pwd : String,
         package_active_date : String,
         package_end_date : Date

}, {timestamps : true })

const employeeModel = mongoose.model('employee', employeeSchema)
module.exports = employeeModel