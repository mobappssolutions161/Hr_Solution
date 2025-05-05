const { ServerDescription } = require('mongodb')
const mongoose = require('mongoose')
const cms_post_your_job_Schema = new mongoose.Schema({
          
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


const cms_postjobModel = mongoose.model('cms_post_your_job_section', cms_post_your_job_Schema)

module.exports = cms_postjobModel