const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['HR Coordinator' , 'Super Admin'],  
    },
    staff_id: {
        type: String, 
        required: function() {
            return this.role === 'HR Coordinator'; 
        },
    },
    permissions: {
        type: [{
                  endpoint : { type : String , required : true },
                  permission : { type : Number , enum : [1 , 0 ], default : 1 }
        }],
        default : []
    },
}, { timestamps: true }); 

const PermissionModel = mongoose.model('Permission', permissionSchema);
module.exports = PermissionModel;
