const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")
const { teamParse } = require('../utils/toornamentObjectsParser')

const tokenInst = ToornamentTokenGest.getInstance()

async function getTeamById(req, res, next) {
    let teamId = req.params.id

    const url = `https://api.toornament.com/organizer/v2/participants/${teamId}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`
        }
    }

    try {
        let response = await axios.get(url, config)

        req.team = teamParse(response.data)

        next()
    } catch (err) {
        if(err.status == 404) {
            return res.status(404).json({
                message: "Equipe introuvable !"
            })
        }

        return res.status(500).json({
            message: "Erreur interne !"
        })
    }
}

module.exports = {
    getTeamById
}