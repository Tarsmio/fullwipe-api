const express = require('express')

const mapCtrl = require("../controllers/mapController")

const mapRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Maps
 *     description: Routes liées au maps
 *         
 */

mapRouter.get('/', mapCtrl.getMaps)

module.exports = mapRouter