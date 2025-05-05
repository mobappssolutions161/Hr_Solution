const mongoose = require('mongoose')
const term_conditionSchema = new mongoose.Schema({

            AdminId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin_and_staffsModel'
            },

          Heading : {
             type : String
          },

          Description : {
              type : String
          },
          company_name : {
            type : String
          }

}, { timestamps : true })

const term_condition = mongoose.model('term_condition', term_conditionSchema)

module.exports = term_condition