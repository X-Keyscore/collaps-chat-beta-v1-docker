const express = require('express')

const ChannelCtrl = require('../controllers/channel-ctrl')

const router = express.Router()

router.post('/channel', ChannelCtrl.createChannel)

router.put('/channel/:id', ChannelCtrl.updateChannel)

router.delete('/channel/:id', ChannelCtrl.deleteChannel)

router.get('/channel/id/:id', ChannelCtrl.getChannelById)

module.exports = router