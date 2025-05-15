const mongoose = require("mongoose");

const fixit_finder_Schema = new mongoose.Schema(
  {
    Full_Name: { type: String },
    Mobile_Number: { type: String },
    Mobile_Number_2: { type: String },
    Gender: { type: String, enum: ["Male", "Female", "Others", "male", "female", "others"] },
    Workshop_Address: { type: String },
    Business_Name: { type: String },
    Home_Address: { type: String },
    Location_in_Sierra_Leone: { type: String },
    applicable: { type: String },
    other: { type: String },
    timeStamp: { type: Date, default: Date.now },  
  },
  { timestamps: true }
);

const fixit_finder_model = mongoose.model("fixit_finder_model", fixit_finder_Schema);

module.exports = fixit_finder_model;
