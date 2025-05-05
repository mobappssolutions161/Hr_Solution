const mongoose = require('mongoose')
const Main_job_titleSchema = new mongoose.Schema({
    Main_jobTitle : {
    type : String,
    required : true
}  

},
{timestamps: true}
)

const main_jobTitleModel = mongoose.model('main_jobTitle', Main_job_titleSchema);

module.exports = main_jobTitleModel;
