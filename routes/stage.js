const express = require('express')

const stageCtrl = require("../controllers/stageController")

const stageRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Stage
 *     description: Routes liées au maps
 *         
 */

stageRouter.get('/', stageCtrl.getStages)

module.exports = stageRouter