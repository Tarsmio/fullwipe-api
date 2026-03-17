const express = require('express')

const {getMatchById} = require ("../midlware/searchMatch")

const matchCtrl = require("../controllers/matchController")

const matchRouter = express.Router()

matchRouter.get("/:id", getMatchById, matchCtrl.getMatch)

module.exports = matchRouter