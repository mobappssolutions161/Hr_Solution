const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
      
          empId : {           
                type: mongoose.Schema.Types.ObjectId,
                ref: 'employeeModel'
            }, 
          
           title :
           {
            type : String
           } ,

           message : {
            type : String
           },

           status : {
              type : Number,
              enum : [1 ,0],
              default : 1
           },

           date: {
            type: Date,          
        },

        empIds : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employeeModel',
         }],
}, {timestamps : true })

 const empNotificationModel = mongoose.model('emp_notification', notificationSchema)

 module.exports = empNotificationModel