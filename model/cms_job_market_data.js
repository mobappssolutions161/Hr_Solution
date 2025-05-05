const { ServerDescription } = require('mongodb')
const mongoose = require('mongoose')
const cms_job_market_data_Schema = new mongoose.Schema({
          
           AdminId : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'Admin_and_staffsModel'
           },
              logo : {
                type : String
              },
              Heading : {
                type : String,
              },
              Description : {
                type : String
              }
}, { timestamps : true })


const cms_jobMarketData = mongoose.model('cms_job_market_data_section', cms_job_market_data_Schema)

module.exports = cms_jobMarketData