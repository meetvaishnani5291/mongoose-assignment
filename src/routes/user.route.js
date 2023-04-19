const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const auth = require('../middlewares/auth')

router.post('/login', userController.loginUser)

router.get('/logout', auth, userController.logoutUser)

router.get('/', auth, userController.viewProfile)

router.post('/', userController.createProfile)

router.patch('/',auth,userController.updateProfile)

router.delete('/', auth, userController.deleteProfile)

module.exports = router;