const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../upload')
const userController = require('../controller/userController')
const upload2=require("../multerConfig")
const authUser = require('../middleware/authMiddleware')
const tokenBlackList = require('../middleware/tokenBlackList')
const role_check = require('../middleware/role_check') 

                                      /* Employer Section */
        // APi for employee SignUp

        router.post('/employeeSignup', upload.single('profileImage'), userController.employeeSignup )
        // APi for login employee
        router.post('/Emp_login', userController.Emp_login)
        // APi for getEmployeeDetails
                router.get('/getEmployeeDetails/:empId', userController.getEmployeeDetails)
        // APi for updateEmp
        router.put('/updateEmp/:empId', upload.single('profileImage'), userController.updateEmp)
        // APi for emp_ChangePassword
                router.post('/emp_ChangePassword/:empId', userController.emp_ChangePassword)
        // Api for get activejobs_by_client
                router.get('/activejobs_by_client/:client_id', userController.activejobs_by_client)
        // Api for get Inactivejobs_by_client
        router.get('/Inactivejobs_by_client/:client_id', userController.Inactivejobs_by_client)
        
        
        router.post('/clientSignup', upload.single('profileImage'), userController.clientSignup )
        router.get('/getAllClients', userController.getAllClients);

                 // forget password Api -- 
                          //otp send  to client email account  

 router.post('/forgetPassOTP', userController.forgetPassOTP)

 // verify OTP
router.post('/verifyOTP', userController.verifyOTP) 

// reset password and token verify

router.post('/clientResetPass/:clientId', userController.clientResetPass) 
        

                                                 /*job title section */
        // Api for add jobTitle
                         router.post('/addJobTitle', authUser, role_check('/addJobTitle'), userController.addJobTitle)
        // Api for alljobTitle
                        router.get('/alljobTitle', userController.alljobTitle)
        // Api for deletejobTitle
                         router.delete('/deletejobTitle/:jobtitle_id',  authUser, role_check('/deletejobTitle'), userController.deletejobTitle)

                                                  /* job Description */

        // Api for add jD
                         router.post('/addJob_Description', authUser, role_check('/addJob_Description'), userController.addJob_Description)
        // Api for alljobDescription
                        router.get('/alljobDescription', userController.alljobDescription)
        // Api for getJd
                        router.post('/getJd' , userController.getJd)
        // Api for deleteJob_Description
                        router.delete('/deleteJob_Description/:Jd_id', authUser, role_check('/deleteJob_Description'), userController.deleteJob_Description)
          // Api for download_jd
                        router.get('/download_jd/:jd_id' , userController.download_jd) 

   
                                           /* psychomatric testing section */
       

        // Api for add category
        router.post('/add_test_Category', userController.add_test_Category)
        // Api for getAll_psychometric_Category
                        router.get('/getAll_psychometric_Category', userController.getAll_psychometric_Category)
        // Api for Delete_category
                        router.delete('/Delete_category/:category_id', userController.Delete_category)
        // Api for psychometric_test
                        router.post('/psychometric_test/:client_id', upload.single('file'), userController.psychometric_test)
        // Api for get_test
                        router.get('/get_test/:test_id', userController.get_test)
        // Api for getAll_psychometric_test_of_client
                        router.get('/getAll_psychometric_test_of_client/:client_id', userController.getAll_psychometric_test_of_client)
        // Api for add_question_in_test
                        router.post('/add_question_in_test/:test_id', upload.single('question_image'),userController.add_question_in_test )
        // Api for delete_question_in_test
                        router.delete('/delete_question_in_psychometric_test/:test_id/:questionId', userController.delete_question_in_psychometric_test )
         // Api for deletepsychometrcTest
                        router.delete('/deletepsychometrcTest/:psychometric_id', userController.deletepsychometrcTest)

                                                      /* POST job section */
        // Api for postJob
                router.post('/postJob/:empId', authUser, role_check('/postJob'), upload.single('job_image') , userController.postJob)
        // Api for updateJob
                 router.post('/updateJob/:jobId' , authUser, role_check('/updateJob'),  userController.updateJob)
        // Api for getJobs_posted_by_employee
                router.get('/getJobs_posted_by_employee/:empId' , userController.getJobs_posted_by_employee)
        // Api for get particular job'
                router.get('/getJob/:jobId', userController.getJob)
        // Api for get_Female_jobseeker_profile
                router.get('/get_Female_jobseeker_profile/:jobId', userController.get_Female_jobseeker_profile)
        // Api for get_jobseeker_profile
                router.get('/get_jobseeker_profile/:jobId', userController.get_jobseeker_profile)
         // Api for deleteJob
                router.delete('/deleteJob/:jobId', authUser, role_check('/deleteJob'),  userController.deleteJob)
         // Api for deleteCandidate
                router.delete('/deleteCandidate/:candidateId', authUser, role_check('/deleteCandidate'),  userController.deleteCandidate)
        // Api for export_candidate
                router.get('/export_candidate/:gender', userController.export_candidate)

        
                                      /* JOb Seeker section */
        // Api for allJobs
                router.get('/getAll_Jobs', userController.getAll_Jobs)

        // Api for searchJob
                router.post('/searchJob', userController.searchJob)
        // Api for filter job
                router.post('/filterJob', userController.filterJob)
        // Api for apply_on_job
                router.post('/apply_on_job/:jobId', upload.single('uploadResume'), userController.apply_on_job)

                                   /*Notification section */

        // Api for getNotification_emp
                router.get('/getNotification_emp/:empId', userController.getNotification_emp)
        // Api for seenNotification
                router.post('/seenNotification/:notification_id', userController.seenNotification)
        // Api for get unseenNotificationCount
                router.get('/unseenNotificationCount/:empId', userController.unseenNotificationCount)

                                         /* Privacy Policy Section */

        // Api for getAllEmp_privacy_policy
        router.get('/get_privacy_policy', userController.get_privacy_policy)


                                       /*  Term & condition Section */
       // Api for get_emp_term_condition
       router.get('/get__admin_term_condition', userController.get__admin_term_condition)

                                      /* Services Page */
                                      
         // Api for getServices page Details
                 router.get('/getServices_of_smart_start', userController.getServices_of_smart_start)

                                        /* CMS */
        // Api for dashboard_counts
                 router.get('/dashboard_counts', userController.dashboard_counts)
        // Api for cms_getJobs_posted_procedure_section1
                 router.get('/cms_getJobs_posted_procedure_section1', userController.cms_getJobs_posted_procedure_section1)
        // APi for cms_get_need_any_job_section2
                 router.get('/cms_get_need_any_job_section', userController.cms_get_need_any_job_section)
        // Api for get_cms_post_your_job
                 router.get('/get_cms_post_your_job', userController.get_cms_post_your_job)
        // Api for cms_getjob_market_data
                router.get('/cms_getjob_market_data', userController.cms_getjob_market_data)
        // Api for fixit_finder
                router.post('/fixit_finder', userController.fixit_finder)

                                            /* Dashboard */
         //Api for client_dashboardCount
                router.get('/client_dashboardCount/:client_id', userController.client_dashboardCount)

                              
                                         

                                          /* Contact US page */
         // Api for create_contactUS
                router.post('/create_contactUS', userController.create_contactUS)

                                        /* upload Resume */

         // Api for uploadResume
                 router.post('/uploadResume', upload.single('uploadResume') , userController.uploadResume)
        // Api for get_upload_section_candidates
                 router.get('/get_upload_section_candidates', authUser, role_check('/get_upload_section_candidates'),  userController.get_upload_section_candidates)
        // Api for candidate_recruitment_process_for_uploaded_candidate
                 router.post('/candidate_recruitment_process_for_uploaded_candidate/:candidateId' , userController.candidate_recruitment_process_for_uploaded_candidate)
        // Api for get_successfull_candidate
                 router.get('/get_successfull_candidate', userController.get_successfull_candidate)

        // Api for all_active_jobs_Count_with_title
                  router.get('/all_active_jobs_Count_with_title', userController.all_active_jobs_Count_with_title)

                                       /* Blog section comment */

        // Api for blog_section_comment
                 router.post('/blog_section_comment', userController.blog_section_comment)
        // Api for get_all__blog_section_comments
                 router.get('/get_all__blog_section_comments', userController.get_all__blog_section_comments)

        // Api for share_cv
                 router.post('/share_cv/:candidate_id' , userController.share_cv)
        // Api for save_candidate_profile_for_later
                 router.post('/save_candidate_profile_for_later/:candidate_id', userController.save_candidate_profile_for_later)
        // Api for get_saved_candidate_profile
                 router.get('/get_saved_candidate_profile/:client_id' , userController.get_saved_candidate_profile)

                 // Api for update_candidate_rating
                 router.post('/update_candidate_rating/:candidate_id', userController.update_candidate_rating)

  // Api for all female candidate profile for client
  router.get('/get_female_candidate_for_client/:client_id', userController.get_female_candidate_for_client)
  // Api for get_male_candidate_for_client
     router.get('/get_male_candidate_for_client/:client_id', userController.get_male_candidate_for_client)

     
        // Api for build_cv
        router.post('/build_cv', upload.single('profileImage'), userController.build_cv)

// Api for get_all_candidate_for_client
       router.get('/get_all_candidate_for_client/:client_id', userController.get_all_candidate_for_client)

 
        // Api 
        router.get('/export_client_jobs_candidate/:client_id' , userController.export_client_jobs_candidate)

                                                    /* Courses USer Enroll */
         // Api for courses_user_enroll
         router.post('/courses_user_enroll', upload.single('profileImage') , userController.courses_user_enroll)
         // Api for all_enrolled_user
         router.get('/all_enrolled_user', authUser, role_check('/all_enrolled_user'), userController.all_enrolled_user)
         // Api for enrolled_user_login
         router.post('/enrolled_user_login',  userController.enrolled_user_login)
         // Api for enroll_course
         router.post('/enroll_course/:user_id', userController.enroll_course)
         // Api for update_course_status
         router.post('/update_course_status/:user_id/:course_id', userController.update_course_status)
         // Api for get_my_enrolled_courses
         router.get('/get_my_enrolled_courses/:user_id', userController.get_my_enrolled_courses)
         // Api for get_enrolled_users_count
         router.get('/get_enrolled_users_count/:course_id' , userController.get_enrolled_users_count)
         // Api for topic_quiz
         router.get('/topic_quiz/:topic_id', userController.topic_quiz)
         // Api for update_topic_status
         router.post('/update_topic_status/:user_id/:topic_id' , authUser, role_check('/update_topic_status'), userController.update_topic_status)

         // Api for enroll_user_course_topic_quiz
          router.get('/enroll_user_course_topic_quiz/:enroll_user_id/:topic_id', userController.enroll_user_course_topic_quiz )

        // Api for save_user_quiz_record_of_course_topic
        router.post('/save_user_quiz_record_of_course_topic/:enroll_user_id/:course_id', userController.save_user_quiz_record_of_course_topic)
        
          // Api for get_particular_enrolled_course_details
          router.get('/get_particular_enrolled_course_details/:user_id/:course_id' , userController.get_particular_enrolled_course_details)

         // Api for get_enrolled_user_detail
         router.get('/get_enrolled_user_detail/:enroll_user_id', userController.get_enrolled_user_detail)

         // Api for generate_avg_score_of_enroll_user
         router.get('/generate_avg_score_of_enroll_user/:user_id/:course_id', userController.generate_avg_score_of_enroll_user)

         // Api for download_certificate
         router.get('/download_certificate/:user_id/:course_id', userController.download_certificate)

         // Api for export_client_jobs_filteredcandidate
         router.get('/export_client_jobs_filteredcandidate/:client_id', userController.export_client_jobs_filteredcandidate)

         // Api for download_word_Jd
         router.get('/download_word_Jd/:jd_id', userController.download_word_Jd)



         // Api for add_Main_JobTitle
         router.post('/add_Main_JobTitle', authUser, role_check('/add_Main_JobTitle'),  userController.add_Main_JobTitle)
         // Api for all_main_jobTitle
         router.get('/all_main_jobTitle', userController.all_main_jobTitle)
         // Api for delete_main_jobTitle
         router.delete('/delete_main_jobTitle/:main_jobtitle_id' , authUser, role_check('/delete_main_jobTitle'), userController.delete_main_jobTitle )

         // Api for all_package_transaction
         router.get('/all_package_transaction',authUser, role_check('/all_package_transaction'), userController.all_package_transaction)

         // Api for update_detail
         router.post('/update_detail', userController.update_detail)


         // Api for getAll_Jobs_admin

         router.get('/getAll_Jobs_admin', authUser, role_check('/getAll_Jobs_admin'), userController.getAll_Jobs_admin)
         // Api for all_main_jobTitle_main

         router.get('/all_main_jobTitle_main', authUser, role_check('/all_main_jobTitle_main'), userController.all_main_jobTitle_main)

         router.post("/uploadJobFile/:jobTitleId",upload2.single('jobFile'),userController.uploadJobFile)
         router.post("/updateJobCountById/:id",userController.updateJobCountById)
         router.get("/getAllUploadedJobFiles",userController.getAllUploadedJobFiles)
         router.delete("/deleteJobDescriptionById/:id",userController.deleteJobDescriptionById)
         
        //  router.post('/convertWordToPdf', userController.convertWordToPdf)


module.exports = router
