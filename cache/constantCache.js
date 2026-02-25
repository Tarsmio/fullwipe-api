const { ToornamentTokenGest } = require("../utils/ToornamenTokenGest");
const {teamParse} = require('../utils/toornamentObjectsParser');
const { CachManager } = require("./CachManager");
const { CaheDict } = require("./CacheDict");
const { CacheObject } = require("./CacheObject");
const axios = require('axios')

const cache = CachManager.getInstance()
const tokenInst = ToornamentTokenGest.getInstance()

module.exports = {
  async cacheTeams() {
    const url = `https://api.toornament.com/organizer/v2/participants/?tournament_ids=${process.env.TOORNAMENT_ID}`;
    const config = {
      headers: {
        "X-Api-Key": process.env.TOORNAMENT_API_KEY,
        Authorization: `Bearer ${await tokenInst.getToken()}`,
        Range: `participants=0-49`,
      },
    };

    try {
      const response = await axios.get(url, config);

      let teamCacheDict = new CaheDict()

      response.data.forEach((el) => {
        let cacheId = `team-${el.id}`

        cache.set(cacheId, new CacheObject(teamParse(el)))
        teamCacheDict.addLink(cacheId)
      });

      cache.registerDict('teams', teamCacheDict)

    } catch (err) {
      throw err
    }
  },
};
