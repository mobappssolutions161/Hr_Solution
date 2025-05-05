const { ServerDescription } = require('mongodb')
const mongoose = require('mongoose')
const cms_client_apply_on_job_section_Schema = new mongoose.Schema({
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


const  cms_client_apply_on_job_section_Model = mongoose.model(' cms_client_apply_on_job_section', cms_client_apply_on_job_section_Schema)

module.exports = cms_client_apply_on_job_section_Model