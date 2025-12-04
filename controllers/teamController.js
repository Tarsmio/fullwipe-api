const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")
const {teamParse} = require('../utils/toornamentObjectsParser')

const tokenInst = ToornamentTokenGest.getInstance()

async function getTeams(req, res, next){
    const url = `https://api.toornament.com/organizer/v2/participants/?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range' : `participants=0-49`
        }
    }

    try {
        const response = await axios.get(url, config)

        let teamList = []

        response.data.forEach(el => {
            teamList.push(teamParse(el))
        });

        res.status(200).json(teamList)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message : "Erreur interne !"
        })
    }
}

async function getTeam(req, res, next) {
    res.status(200).json(req.team)
}

module.exports = {
    getTeams,
    getTeam
}