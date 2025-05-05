const mongoose = require('mongoose');

// Define the schema for the client model
const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            
        },
        email: {
            type: String,
            

        },
        password: {
            type: String,
        },
        phone_no: {
            type: String,
            
        },
        company_name: {
            type: String,
            
        },
        Number_of_emp: {
            type: Number,
        },
        company_industry: {
            type: String,
            
        },
        company_HQ: {
            type: String,
            
        },
        profileImage: {
            type: String,
        },
        status: {
            type: Number,
            default: 0, 
        }
    },
    {
        timestamps: true, 
    }
);

// Create a model based on the schema
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
