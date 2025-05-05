const mongoose = require('mongoose')
const cms_employee_outsourcing_schema = new mongoose.Schema({
          

               Heading : {
                       type : String
               },
               Description : {
                    type : String
               },
               image : {
                   type : String
               }
              

}, {timestamps : true })

const cms_employee_outsourcing_Model = mongoose.model('cms_employee_outsourcing', cms_employee_outsourcing_schema)

module.exports = cms_employee_outsourcing_Model