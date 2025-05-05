          const mongoose = require('mongoose')
         const carrer_advice_Schema = new mongoose.Schema({
                  

                  Heading : {
                       type : String
                  } , 
                  Description : {
                       type : String
                  },
                  image : {
                      type : String
                  }
         } , { timestamps : true }) 

         const carrer_advice_model = mongoose.model('carrer_advice' , carrer_advice_Schema)

         module.exports = carrer_advice_model