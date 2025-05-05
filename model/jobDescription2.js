const mongoose  = require("mongoose")

const jobDescription2Scehma = new mongoose.Schema({
    jobTitleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "main_jobTitle"
    },
        jobTitle : {
            type : String
        },
        jobWord : {
            type : String
        },
        jobPdf :  {
            type : String
        },
        count : {
            type  : Number,
            default : 0
        }
},{timestamps:true})


const jobDescription_model2 = mongoose.model('job_Description2', jobDescription2Scehma);

module.exports = jobDescription_model2;
