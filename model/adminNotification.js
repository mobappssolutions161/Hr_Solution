const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
      
          adminId : {           
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin_and_staffsModel'
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

      
}, {timestamps : true })

 const adminNotificationModel = mongoose.model('admin_notification', notificationSchema)

 module.exports = adminNotificationModel