const mongoose = require('mongoose')
const uploadResume_Schema = new mongoose.Schema({

        first_Name : {
             type : String
        },
        last_Name : {
             type : String
        },
        user_Email : {
            type : String
        },
        city : {
             type : String
        },
        phone_no : {
            type : Number
        },
        home_address : {
          type : String
        },
        location : {
          type : String
        },
        gender : {
             type : String,
             enum : ['Male' , 'Female' , 'Others']
        },
        job_Heading : {
              type : String
        },
        upload_Resume : {
             type : String
        },
        jobSeeker_status : {
              type : Number,
              enum : [ 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 ],
              default : 0
        },
        candidate_status : {
             type : Number,
             enum : [ 0 , 1 , 2],
             default : 1                    // 0 for Rejected , 1 for  pending , 2 for screened , 3 for complete
        } ,
        area_of_study : {
            type : String
        },
        area_of_qualification  : {
          type : String
        },
        Highest_Education: {
            type: String,
            enum: ['secondary', 'Higher Secondary', 'Diploma', 'Bachelors', 'Masters', 'Doctorate'] // Corrected 'Bechlore' to 'Bachelors'
        },
}, { timestamps : true })
 

    const ResumeModel = mongoose.model('upload_Resume', uploadResume_Schema)

    module.exports = ResumeModel