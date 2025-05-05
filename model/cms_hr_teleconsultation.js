const mongoose = require("mongoose");
const cms_t_c_schema = new mongoose.Schema(
  {
    Heading: {
      type: String,
    },
    Description: {
      type: String,
    },
    Description1: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const cms_Hr_teleconsultation_model = mongoose.model(
  "cms_Hr_teleconsultation",
  cms_t_c_schema
);

module.exports = cms_Hr_teleconsultation_model;
