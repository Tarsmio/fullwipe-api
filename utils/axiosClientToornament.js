const axios = require('axios')
const {ToornamentTokenGest} = require("../utils/ToornamenTokenGest")

const tokenInst = ToornamentTokenGest.getInstance()


const axiosClient = axios.create({
    baseURL: 'https://api.toornament.com/organizer/v2',
    headers: {
      Accept: 'application/json',
      "X-Api-Key" : process.env.TOORNAMENT_API_KEY,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await tokenInst.getToken()}`
    },
  })

module.exports = {
    axiosClient
}