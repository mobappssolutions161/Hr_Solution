const express = require('express')
const router = express.Router()
const permissionSidebarController = require('../controller/permissionSidebarController')


                                 /* Permission Section */


router.post('/add_sidebar_endPoints' , permissionSidebarController.add_sidebar_endPoints)
// Api for update permission

router.post('/update_sidebar_Permission', permissionSidebarController.update_sidebar_Permission)

// Api for get_permissions_data
router.get('/get_sidebar_permissions_data', permissionSidebarController.get_sidebar_permissions_data)

// Api for get_added_permission_for_staff
router.get('/get_added_sidebar_permission_for_staff/:staff_id', permissionSidebarController.get_added_sidebar_permission_for_staff)



module.exports = router