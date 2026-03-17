const express = require('express')

const stageCtrl = require("../controllers/stageController")

const stageRouter = express.Router()

stageRouter.get('/', stageCtrl.getStages)

module.exports = stageRouter