const mongoose = require('mongoose')
const cms_job_posting_section_1 = new mongoose.Schema({
        
            Heading :{
                type : String
            },
            Description : {
                 type : String
            },
            AdminId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin_and_staffsModel'
               },
}, {timestamps : true })

const cms_job_posting_sectionModel = mongoose.model('cms_job_posting_section_1', cms_job_posting_section_1)

module.exports = cms_job_posting_sectionModel