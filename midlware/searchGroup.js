const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")
const { CachManager } = require('../cache/CachManager')
const { CacheObject } = require('../cache/CacheObject')

const tokenInst = ToornamentTokenGest.getInstance()
const cache = CachManager.getInstance()

async function getGroupById(req, res, next){
    let gId = req.params.id

    let cachedGroup = cache.get(`group-${gId}`)

    if(cachedGroup != null){
        req.group = cachedGroup.getData()
        return next()
    }

    const url = `https://api.toornament.com/organizer/v2/groups/${gId}`
    const config = {
        headers: {
            'X-Api-Key': process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`
        }
    }

    try {
        let response = await axios.get(url, config)

        let repData = response.data

        req.group = repData

        cache.set(`group-${gId}`, new CacheObject(repData, 600000))

        return next()
    } catch (err) {
        console.log(err)
        if(err.status == 404) {
            return res.status(404).json({
                message: "Groupe introuvable !"
            })
        }

        return res.status(500).json({
            message: "Erreur interne !"
        })
    }
}

async function getGroupRankingById(req, res, next) {
    let gId = req.params.id

    let groupRankingCached = cache.get(`group-ranking-${gId}`)

    if(groupRankingCached != null){
        req.ranking = groupRankingCached.getData()
        return next()
    }

    const url = `https://api.toornament.com/organizer/v2/ranking-items?group_ids=${gId}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range': 'items=0-49'
        }
    }

    try {
        let response = await axios.get(url, config)

        req.ranking = response.data

        cache.set(`group-ranking-${gId}`, new CacheObject(response.data, 120000))

        return next()
    } catch (err) {
        console.log(err)
        if(err.status == 404) {
            return res.status(404).json({
                message: "Groupe introuvable !"
            })
        }

        return res.status(500).json({
            message: "Erreur interne !"
        })
    }
}

module.exports = {
    getGroupRankingById,
    getGroupById
}