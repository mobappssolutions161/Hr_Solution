const mongoose = require('mongoose')
const cms_online_cources_Schema = new mongoose.Schema({

      Heading : {
           type : String
      },

      Description : {
          type : String
      },
      Detailed_description : {
           type : String

      },
      price : {
           type : String
      },
      image : {
           type : String
      },

        topic : [{
                         topic_name  : {
                              type : String
                         },

                         topic_description : {
                              type : String
                         },

                         files : {
                              type : [String]
                       },
                         topic_status : {
                              type : Number,
                              enum : [1 ,0],
                              default : 0
                         },


        }],
        
     status : {
             type : Number,
             enum : [ 0 , 1 ],
             default : 1
     }


} , { timestamps : true })

const cms_online_courses_Model = mongoose.model('cms_online_courses', cms_online_cources_Schema)

module.exports = cms_online_courses_Model