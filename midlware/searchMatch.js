const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")
const { teamParse } = require('../utils/toornamentObjectsParser')

const tokenInst = ToornamentTokenGest.getInstance()

function hasWin(result) {
    if(result == "win") return true
    return false
}

async function getMatchById(req, res, next) {
    let matchId = req.params.id

    const url = `https://api.toornament.com/organizer/v2/matches/${matchId}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`
        }
    }

    try {
        let response = await axios.get(url, config)

        let aplhaOp = response.data.opponents[0]
        let bravoOp = response.data.opponents[1]

        console.log(response.data)

        req.match = {
            id: response.data.id,
            status: response.data.status,
            scheduled_datetime: response.data.scheduled_datetime,
            lieu: response.data.public_note,
            scores: {
                alpha : {
                    team_id: aplhaOp.participant.id,
                    win: hasWin(aplhaOp.result),
                    forfeit: aplhaOp.forfeit,
                    point: aplhaOp.score
                },
                bravo : {
                    team_id: bravoOp.participant.id,
                    win: hasWin(bravoOp.result),
                    forfeit: bravoOp.forfeit,
                    point: bravoOp.score
                }
            }
        }

        next()
    } catch (err) {
        console.log(err)
        if(err.status == 404) {
            return res.status(404).json({
                message: "Match introuvable !"
            })
        }

        return res.status(500).json({
            message: "Erreur interne !"
        })
    }
}

module.exports = {
    getMatchById
}