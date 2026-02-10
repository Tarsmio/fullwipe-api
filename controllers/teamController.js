const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")
const {teamParse} = require('../utils/toornamentObjectsParser')
const { fetchStages, fetchGroups, fetchRoundsOfGroups } = require('../utils/toornamentTools')

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

async function getPlanning(req, res, next){
    const url = `https://api.toornament.com/organizer/v2/matches/?tournament_ids=${process.env.TOORNAMENT_ID}&participant_ids=${req.team.team_id}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range' : `matches=0-99`
        }
    }

    try {
        let matchesResponse = await axios.get(url, config)

        //console.log(matchesResponse.data)

        let stages = await fetchStages()
        let groups = await fetchGroups()
        let matches = matchesResponse.data
        
        let listOfGroups = []

        matches.forEach(m => {
            let gId = m.group_id

            if(listOfGroups.indexOf(gId) == -1){
                listOfGroups.push(gId)
            }
        })

        let rounds = await fetchRoundsOfGroups(listOfGroups)

        /*let test = {
            phase : {
                name: "ugsf",
                id: "545"
            },
            matches : [
                {
                    tour_name : "Groupe 7 - Tour 1" : phase.name - 1/8 finale
                    //info match
                }
            ]
        }*/

        let planningObject = []

        matches.forEach(m => {
            let stageFinded = planningObject.find(({phase}) => phase.id == m.stage_id)

            if(stageFinded){
                stageFinded.matches.push({
                    id: m.id,
                    tour_name: rounds.find(({id}) => id == m.round_id).name,
                    date: m.scheduled_datetime,
                    place: m.public_note,
                    versus: m.opponents.find(({participant}) => participant.id != req.team.team_id).participant.name,
                    op_id: m.opponents.find(({participant}) => participant.id != req.team.team_id).participant.id,
                    played: m.status == "completed" ? true : false
                })
            } else {
                let stageOfMatch = stages.find(({id}) => id == m.stage_id)
                objectToPush = {
                    phase: {
                        name: stageOfMatch.name,
                        id : stageOfMatch.id
                    },
                    matches : [{
                        id: m.id,
                        tour_name: rounds.find(({id}) => id == m.round_id).name,
                        date: m.scheduled_datetime,
                        place: m.public_note,
                        versus: m.opponents.find(({participant}) => participant.id != req.team.team_id).participant.name,
                        op_id: m.opponents.find(({participant}) => participant.id != req.team.team_id).participant.id,
                        played: m.status == "completed" ? true : false
                    }]
                }

                planningObject.push(objectToPush)
            }
        })

        return res.status(200).json(planningObject)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message : "Erreur interne !"
        })
    }
}

module.exports = {
    getTeams,
    getTeam,
    getPlanning
}