const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")

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
            let teamObject = {
                team_id : el.id,
                logo : el.logo,
                created_at : el.created_at,
                name: el.name,
                discord_cap : el.custom_fields.identifiant_discord_du_capitaine,
                lineup: []
            }

            el.lineup.forEach(player => {
                let playerObject = {
                    name: player.name,
                    discord: player.custom_fields.identifiant_discord_du_joueur
                }

                teamObject.lineup.push(playerObject)
            })

            teamList.push(teamObject)
        });

        res.status(200).json(teamList)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message : "Erreur interne !"
        })
    }
}

module.exports = {
    getTeams
}