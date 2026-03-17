const express = require('express')

const groupCtrl = require("../controllers/groupController")
const { getGroupById, getGroupRankingById } = require('../midlware/searchGroup')

const groupRouter = express.Router()

groupRouter.get('/', groupCtrl.getGroupsListId)
groupRouter.get('/:id', getGroupById, getGroupRankingById, groupCtrl.getGroup)

module.exports = groupRouter