const express = require('express')

const teamCtrl = require("../controllers/teamController")

const teamRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Team
 *     description: Routes liées au equipe
 *         
 */

teamRouter.get('/', teamCtrl.getTeams)

module.exports = teamRouter