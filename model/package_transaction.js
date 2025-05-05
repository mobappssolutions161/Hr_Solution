const mongoose = require('mongoose');

const package_transaction = new mongoose.Schema({

    booking_id : {
           type : String
    },

    package_id: {
        type  : String
    },
    client_id: {
        type : String
    },
    package_name : {
          type : String,
          default : ''
    },
    client_name : {
           type : String,
           default : ''
    },
    company : {
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

const package_transaction_model = mongoose.model('package_transaction', package_transaction)

module.exports = package_transaction_model