const permissionSidebarModel = require('../model/permission_sidebar_model')
const Admin_and_staffsModel = require('../model/Admin_and_staffs')



const add_sidebar_endPoints = async (req, res) => {
    try {
        const { role, endpoints, staff_id } = req.body;

        // Validate input
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Role is required',
            });
        }
        if (!endpoints || !Array.isArray(endpoints) || endpoints.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'endPoints must be a non-empty array',
            });
        }

        if (role === 'HR Coordinator' && !staff_id) {
            return res.status(400).json({
                success: false,
                message: `Staff Id is required for role: ${role}`,
            });
        }   
        // Check if the staff exists 
        if (role === 'HR Coordinator') {
            const staff = await Admin_and_staffsModel.findOne({ staff_id }); 
            if (!staff) {
                return res.status(400).json({
                    success: false,
                    message: `Staff not found with the staff_id : ${staff_id}`,
                });
            }
        }

        // Prepare query for permissions lookup
        const query = role === 'HR Coordinator' ? { role, staff_id } : { role };

        // Find or create permission document
        let permissionDoc = await permissionSidebarModel.findOne(query);
        
        if (!permissionDoc) {
            // Create a new document if none exists
            const permissions = endpoints.map(endpoint => ({ endpoint, permission: 1 }));
            await permissionSidebarModel.create({ role, staff_id, permissions });
        } else {
            // Add new endpoints to the existing document
            const existingEndpoints = permissionDoc.permissions.map(p => p.endpoint);

            endpoints.forEach(endpoint => {
                if (!existingEndpoints.includes(endpoint)) {
                    permissionDoc.permissions.push({ endpoint, permission: 1 });
                }
            });

            await permissionDoc.save();
        }

        // Successful response
        res.status(200).json({
            success: true,
            message: 'Endpoints added successfully',
        });

    } catch (error) {
        // Error response
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
};


// APi for update permission

const update_sidebar_Permission = async (req, res) => {
    try {
        const { role, permissions, staff_id } = req.body;

         // check for role
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }
            
        // Validate permissions array
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Permissions must be a non-empty array",
            });
        }
            
                if (role === "HR Coordinator" && !staff_id) {
            return res.status(400).json({
                success: false,
                message: `Staff Id is required for role: ${role}`,
            });
        }
              
        // check for staff_id 

        if (role === "HR Coordinator") {
            const staff = await Admin_and_staffsModel.findOne({ staff_id });
            if (!staff) {
                return res.status(400).json({
                    success: false,
                    message: `Staff not found with the staff_id: ${staff_id}`,
                });
            } 
        }
               
        const query = role === "HR Coordinator" ? { role, staff_id } : { role };

        // Find or create permission document
        let permissionDoc = await permissionSidebarModel.findOne(query);

        if (!permissionDoc) {
             
            const formattedPermissions = permissions.map(({ endpoint, allow }) => ({ endpoint, permission: allow ? 1 : 0 }));
            await permissionSidebarModel.create({ role, staff_id, permissions: formattedPermissions });
        } else {
            
            const existingEndpoints = permissionDoc.permissions.map(p => p.endpoint)

            permissions.forEach(({ endpoint , allow }) => {
                const existingPermission = permissionDoc.permissions.find(p => p.endpoint === endpoint)
                if (existingPermission) {
                  
                    existingPermission.permission = allow ? 1 : 0 ;
                } else {
                    
                    permissionDoc.permissions.push({ endpoint, permission: allow ? 1 : 0 });
                }
            });

            await permissionDoc.save();
        }

        
        res.status(200).json({
            success: true,
            message: "Permissions updated successfully",
        });

    } catch (error) {
        // Error response
        res.status(500).json({
            success: false,
            message: "Server error",
            error_message: error.message,
        });
    }
};




// Api for get all permissions

     const get_sidebar_permissions_data = async( req , res )=> {
            try {
                        // check for all permissions
                         const permissions = await permissionSidebarModel.find({ })
                         if(!permissions)
                         {
                               return res.status(400).json({
                                  success : false ,
                                  message : 'Permissions Record not found'
                               })
                         }
                           
                         return res.status(200).json({
                               success : true ,
                               message : 'Permissions Records',
                               records : permissions.map((p)=> ({
                                    role : p.role,
                                    staff_id : p.staff_id || ' ',
                                    endPoints_permissions : p.permissions
                               }))
                         })
            } catch (error) {
                 return res.status(500).json({
                       success : false ,
                       message : 'Server error', 
                       error_message : error.message
                 })
            }
     }


      
           
     // APi for get permissions for role

              const get_added_sidebar_permission_for_staff = async( req , res )=> {
                    try {
                           const { staff_id } = req.params
                           if(!staff_id)
                           {
                              return res.status(400).json({
                                   success : false ,
                                   message : 'Staff Id Required'
                              })
                           }
                                 
                           // check for staff 
                           const check_staff = await permissionSidebarModel.findOne({ staff_id : staff_id })
                           if(!check_staff)
                           {
                              return res.status(200).json({
                                   success : false ,
                                   message : 'No Permission found yet for Staff'
                              })
                           }
                                                                                     
                                // Extract only the endpoints with permission value 1
                                const filteredEndpoints = check_staff.permissions
                                .filter(permission => permission.permission === 1)
                                .map(permission => permission.endpoint);

                                

                           return res.status(200).json({
                               success : true ,
                               message : 'Staff Permission',
                               role : check_staff.role,
                               staff_id : check_staff.staff_id,
                               permissions : filteredEndpoints
                           })
                    } catch (error) {
                          return res.status(500).json({
                               success : false ,
                               message : 'Server error',
                               error_message : error.message
                          })
                    }
              }



module.exports = { add_sidebar_endPoints , update_sidebar_Permission  , get_sidebar_permissions_data , get_added_sidebar_permission_for_staff }