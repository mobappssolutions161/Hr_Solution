const mongoose = require("mongoose");
const cms_elite_talent_pool_Schema = new mongoose.Schema(
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

const cms_elite_talent_pool_Model = mongoose.model(
  "cms_elite_talent_pool",
  cms_elite_talent_pool_Schema
);

module.exports = cms_elite_talent_pool_Model;
