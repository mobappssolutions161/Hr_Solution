const mongoose = require('mongoose');

const course_transaction = new mongoose.Schema({

    booking_id : {
           type : String
    },

    course_id: {
        type  : String
    },
    enroll_user_id: {
        type : String
    },
    course_name : {
          type : String,
          default : ''
    },
    user_name : {
           type : String,
           default : ''
    },
    amount: {
        type: Number
    },
    payment_status: {
        type: String
    },
    session_id: {
        type: String
    },
    kind: {
        type: String
    },
    payment_time: {
        type: String
    },
    payment_info: {
        state: {
            type: String
        },
        method: {
            kinds: {
                type : [String], 
                default: [] 
            }
        },
        financialAccount: {
            type: String, 
            default: ''   
        }
    },
    currency: {
        type: String
    },

    payment_key : {
           type : Number,
            enum : [ 1 , 2 ]
    }
}, { timestamps: true });

const course_transaction_model = mongoose.model('course_transaction', course_transaction)

module.exports = course_transaction_model