const mongoose = require('mongoose')
const jobSkillsSchema = new mongoose.Schema({

        jobTitle : {
        type : String,
        required : true
    }  ,
        skill_Name : {
        type : String
    },
   
  
    
}, {timestamps : true})

const jobSkills_Model = mongoose.model('job_skilss', jobSkillsSchema)

module.exports = jobSkills_Model