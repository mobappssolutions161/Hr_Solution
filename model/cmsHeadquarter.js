const mongoose = require('mongoose')
const cmsHeadquarte_Schema = new  mongoose.Schema({
            AdminId : {
                   type : mongoose.Schema.Types.ObjectId,
                   ref : 'Admin_and_staffsModel'
            },

             company_address : {
                 type : String
             },

              location : {
                    type : String
              },

}, {timestamps : true })

const cmsHeadquarte_model = mongoose.model('cms_headquarter', cmsHeadquarte_Schema)

module.exports = cmsHeadquarte_model