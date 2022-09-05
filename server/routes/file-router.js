const express = require('express')

const FileCtrl = require('../controllers/file-ctrl')

const router = express.Router()

// Avatar upload
router.post('/file/upload/avatar/:id/:token', FileCtrl.uploadFileAvatar)

// File upload
router.post('/file/upload/msg/:id/:token/:fileId', FileCtrl.uploadFileMsg)


router.get('/file/get/:type/:id', FileCtrl.getFileById)

router.delete('/file/delete/:type/:id', FileCtrl.deleteFileById)

module.exports = router