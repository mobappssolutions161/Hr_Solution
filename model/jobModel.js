const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
    },
    job_title: {
      type: String,
    },
    sub_job_title: {
      type: String,
    },
    company_name: {
      type: String,
    },
    emp_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel",
    },
    Number_of_emp_needed: {
      type: String,
    },
    qualification : {
      type : String
    },
    job_type: {
      type: String,
      // enum: ['Full-Time', 'Part-Time', 'Temporary', 'Contract', 'Internship', 'Commission', 'Fresher', 'Volunteer', 'Walk-In']
    },
    job_schedule: {
      type: String,
      // enum: ['Day Shift', 'Morning Shift', 'Rotational Shift', 'Night Shift', 'Monday to Friday', 'Evening Shift', 'US Shift', 'UK Shift', 'Others']
    },
    salary_pay: [
      {
        Minimum_pay: {
          type: String,
        },
        Maximum_pay: {
          type: String,
        },
        Rate: {
          type: String,
          // enum: ['per Month', 'per Year', 'per Week', 'per Day', 'per Hour']
        },
      },
    ],
    job_Description: {
      type: String,
    },
    job_Responsibility: {
      type: String,
    },
    company_address: {
      type: String,
    },
    employee_email: {
      type: String,
    },
    requirement_timeline: {
      type: String,
      // enum: ['1 to 3 Days', '3 to 7 Days', '1 to 3 Week', 'more than Month']
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    phone_no: {
      type: Number,
    },
    skills: 
      {
        type: String, // Assuming skills are strings
      },
    acadmic_qualification: 
      {
        type: String,
      },
    // key_qualification: [
    //   {
    //     type: String, // Assuming skills are strings
    //   },
    // ],
    acadmic_qualification: [
      {
        type: String,
      },
    ],
    Experience: {
      type: String,
    },
    template_type: {
      type: String,
      // enum : [1,2,3,4,5],
    },
    company_Industry: {
      type: String,
    },
    location: {
      type: [String],
    },

    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 1,
    },
    //     isPsychometricTest : {
    //         type: Number,
    //         enum : [0 ,1],
    //         default: 0
    //     },
    //     psychometric_Test : {
    //         type : String ,

    //   },

    fav_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    job_image: {
      type: String,
    },

    hr_email: String,

    hiring_manager_email: String,
  },
  { timestamps: true }
);

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;
