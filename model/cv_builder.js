const mongoose = require('mongoose');

const cvBuilderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        
    },
    lastName: {
        type: String,
        
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    zip: {
        type: Number
    },
    phoneNo: {
        type : Number
    },
    userEmail: {
        type: String,
      
    },
    jobExperience: [{
        jobTitle: {
            type: String
        },
        employer: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        isCurrentlyWorking: {
            type: Number,
            enum : [1 , 0], 
            default: 0
        },
        workExperienceDescription: [{
            description: {
                type: String
            }
        }]
    }],
    Education: [{
        schoolName: {
            type: String
        },
        schoolLocation: {
            type: String
        },
        degree: {
            type: String
        },
        fieldOfStudy: {
            type: String
        },
        graduationDate: {
            start_Date: {
                type: String
            },
            end_Date: {
                type: String
            },
            isStillEnrolled: {
                type: Number, 
                enum : [1 ,0],
                default: 0
            }
        }
    }],
    skills: [{
        skillName: {
            type: String
        }
    }],
    jobTitleSummary: {
        type: String
    },
    certificates: [{
        title: {
            type: String
        },
        description: {
            type: String
        }
    }],
    languagesKnown: [{
        languageName: {
            type: String
        }
    }],
    websitesAndSocialLinks: {
        linkedIn: {
            type: String
        },
        github: {
            type: String
        },
        portfolio: {
            type: String
        },
        twitter: {
            type: String
        },
        stackOverflow: {
            type: String
        },
        codepen: {
            type: String
        }
    },
    awardsAndAchievements: [{
        awardAchievementName: {
            type: String
        }
    }],
    templateType: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 1
    },
    profileImage : {
           type : String
    }
}, { timestamps: true });

const CvBuilderModel = mongoose.model('cv_builder', cvBuilderSchema);

module.exports = CvBuilderModel;
