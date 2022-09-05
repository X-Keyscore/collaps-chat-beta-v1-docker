const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const router = express.Router()

router.post('/user/autologin', UserCtrl.autologinUser)
router.post('/user/login', UserCtrl.loginUser)
router.post('/user/registering', UserCtrl.registeringUser)

router.put('/user/:id', UserCtrl.updateUser)

router.delete('/user/:id', UserCtrl.deleteUser)

router.get('/user/id/:id', UserCtrl.getUserById)
router.get('/user/pseudo/:pseudo', UserCtrl.getUserByPseudo)

module.exports = router
