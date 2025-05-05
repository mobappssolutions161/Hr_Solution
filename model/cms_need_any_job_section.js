const { ServerDescription } = require('mongodb')
const mongoose = require('mongoose')
const cms_need_any_job_section_Schema = new mongoose.Schema({
          
           AdminId : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'Admin_and_staffsModel'
           },
              logo : {
                type : String
              },
              Heading : {
                type : String,
              },
              Description : {
                type : String
              }
}, { timestamps : true })


const cms_need_any_job_section_Model = mongoose.model('cms_need_any_job_section', cms_need_any_job_section_Schema)

module.exports = cms_need_any_job_section_Model