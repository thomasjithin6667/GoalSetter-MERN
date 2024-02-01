const express = require('express')
const router =express.Router()


const {adminAccount,loginAdmin,getUsers,userBlock,editUser,searchUser}= require('../controllers/adminController')
const { protectAdmin} = require('../middleware/authMiddleware')

router.post('/search',protectAdmin,searchUser)
router.post('/login',loginAdmin)
router.get('/account',protectAdmin,adminAccount)
router.get('/',protectAdmin,getUsers)
router.post('/block',protectAdmin,userBlock)
router.put('/:userId',protectAdmin,editUser)





module.exports=router
