const permissionModel = require('../model/permission_model')

const role_check = (requiredEndpoint) => async (req, res, next) => {
    try {
        const userRole = req.user.role; 
        const staffId = req.user.staff_id; 

        let query = { role: userRole };
        if (userRole === 'HR Coordinator') {
            query.staff_id = staffId;
        }
        // Fetch the permission document for the user
        const permission = await permissionModel.findOne(query);

        if (!permission) {
            return res.status(400).json({
                success: false,
                message: `Dear ${userRole}, you are not authorized to access this section!.`,
            });
        }
                
        // Check if the required endpoint exists and has permission > 0
        const hasAccess = permission.permissions.some(
            (p) => p.endpoint === requiredEndpoint && p.permission > 0
              );
        if (!hasAccess) {
            return res.status(400).json({
                success: false,
                message: `Dear ${userRole}, you are not authorized to access this section!`,
            });
        }

        next(); 
        

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};


module.exports = role_check 