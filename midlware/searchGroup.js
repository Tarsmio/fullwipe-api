const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")

const tokenInst = ToornamentTokenGest.getInstance()

async function getGroupById(req, res, next){
    const url = `https://api.toornament.com/organizer/v2/groups/${req.params.id}`
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

        next()
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

        next()
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