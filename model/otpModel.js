const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,      
        ref: "employeeModel",
    },
    AdminId: {
        type: Schema.Types.ObjectId,       
        ref: "Admin_and_staffsModel",
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, 
    },
});

const otpModel = mongoose.model('otpModel', OTPSchema);

module.exports = otpModel;
