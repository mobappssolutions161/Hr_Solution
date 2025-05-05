const mongoose = require('mongoose')
const sl_loc_lat_long_Schema = new mongoose.Schema({

         loc : String ,
         lat : Number,
         long : Number,

}, { timestamps : true })

const sl_loc_model = mongoose.model('sl_loc' , sl_loc_lat_long_Schema)

module.exports = sl_loc_model