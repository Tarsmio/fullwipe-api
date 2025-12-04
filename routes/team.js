const express = require('express')

const teamCtrl = require("../controllers/teamController")
const { getTeamById } = require('../midlware/searchTeam')

const teamRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Team
 *     description: Routes liées au equipe
 *         
 */

teamRouter.get('/', teamCtrl.getTeams)

teamRouter.get('/:id', getTeamById, teamCtrl.getTeam)

module.exports = teamRouter