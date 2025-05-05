const mongoose = require('mongoose')
const privacy_policySchema = new mongoose.Schema({
     
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
         
}, {timestamps : true })

const privacy_policyModel = mongoose.model('privacy_policy', privacy_policySchema)

module.exports = privacy_policyModel