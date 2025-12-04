const axios = require('axios')
const {ToornamentTokenGest} = require("./ToornamenTokenGest")

const tokenInst = ToornamentTokenGest.getInstance()

async function fetchStages(){
    const url = `https://api.toornament.com/organizer/v2/stages?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            'X-Api-Key': process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range': "stages=0-49",
        }
    }

    try {
        let response = await axios.get(url, config)

        return response.data
    } catch (err) {
        throw err
    }
}

async function fetchGroups() {
    const url = `https://api.toornament.com/organizer/v2/groups?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            'X-Api-Key': process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range': "groups=0-49",
        }
    }

    try {
        let response = await axios.get(url, config)

        return response.data
    } catch (err) {
        throw err
    }
}

async function fetchRoundsOfGroups(gIds){
    const url = `https://api.toornament.com/organizer/v2/rounds?tournament_ids=${process.env.TOORNAMENT_ID}&?group_ids=${gIds}`
    const config = {
        headers: {
            'X-Api-Key': process.env.TOORNAMENT_API_KEY,
            'Authorization': `Bearer ${await tokenInst.getToken()}`,
            'Range': "rounds=0-49",
        }
    }

    try {
        let response = await axios.get(url, config)

        return response.data
    } catch (err) {
        throw err
    }
}

module.exports = {
    fetchStages,
    fetchGroups,
    fetchRoundsOfGroups
}