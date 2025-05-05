const mongoose = require('mongoose')
const cms_labour_tool_Schema = new mongoose.Schema({

      Heading : {
           type : String
      },

      Description : {
          type : String
      }


} , { timestamps : true })

const cms_labour_tool_Model = mongoose.model('cms_labour_tool', cms_labour_tool_Schema)

module.exports = cms_labour_tool_Model