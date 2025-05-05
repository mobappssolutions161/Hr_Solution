const mongoose = require('mongoose')
const service_Schema = new mongoose.Schema({
                AdminId : {
                      type : mongoose.Schema.Types.ObjectId,
                      reference : 'Admin_and_staffsModel'
                },
                Heading : {
                        type : String
                },
                Description: {
                     type : String
                },               
                Description1: {
                     type : String
                },               
               
                 image : {
                       type : String
                 }
}, {timestamps : true})

   const services = mongoose.model('service', service_Schema)
   module.exports = services