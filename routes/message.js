const express = require('express')

const messageCtrl = require("../controllers/mesaggeCtrl")
const { authMessage } = require('../midlware/authMessage')
const { getMessage } = require("../midlware/searchMessage")

const messageRouter = express.Router()

messageRouter.get("/", authMessage, messageCtrl.getMessages)
messageRouter.post("/", authMessage, messageCtrl.sendMessage)

messageRouter.delete("/:id", authMessage, getMessage, messageCtrl.deleteMessage)

messageRouter.post('/subscribe', messageCtrl.saveSub)
module.exports = messageRouter