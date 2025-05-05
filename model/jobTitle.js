const mongoose = require('mongoose')
const job_titleSchema = new mongoose.Schema({
jobTitle : {
    type : String,
    required : true
}  

},
{timestamps: true}
)

const jobTitleModel = mongoose.model('jobTitle', job_titleSchema);

module.exports = jobTitleModel;
