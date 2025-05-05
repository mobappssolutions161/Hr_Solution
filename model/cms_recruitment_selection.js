const mongoose = require('mongoose')
const cms_recruitment_selection_schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               },
               image : {
                   type : String
               }
              

}, {timestamps : true })

const cms_recruitment_selection_Model = mongoose.model('cms_recruitment_selection', cms_recruitment_selection_schema)

module.exports = cms_recruitment_selection_Model