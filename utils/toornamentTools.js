const axios = require("axios");
const { ToornamentTokenGest } = require("./ToornamenTokenGest");

const { CachManager } = require("../cache/CachManager");
const { CacheObject } = require("../cache/CacheObject");

const tokenInst = ToornamentTokenGest.getInstance();
const cache = CachManager.getInstance();

async function fetchStages() {
  let cachedStages = cache.get(`stages-${process.env.TOORNAMENT_ID}`);

  if (cachedStages != null) {
    return cachedStages.getData();
  }

  const url = `https://api.toornament.com/organizer/v2/stages?tournament_ids=${process.env.TOORNAMENT_ID}`;
  const config = {
    headers: {
      "X-Api-Key": process.env.TOORNAMENT_API_KEY,
      Authorization: `Bearer ${await tokenInst.getToken()}`,
      Range: "stages=0-49",
    },
  };

  try {
    let response = await axios.get(url, config);

    cache.set(
      `stages-${process.env.TOORNAMENT_ID}`,
      new CacheObject(response.data)
    );

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function fetchGroups() {
  let cachedGroups = cache.get(`groups-${process.env.TOORNAMENT_ID}`);

  if (cachedGroups != null) {
    return cachedGroups.getData();
  }

  const url = `https://api.toornament.com/organizer/v2/groups?tournament_ids=${process.env.TOORNAMENT_ID}`;
  const config = {
    headers: {
      "X-Api-Key": process.env.TOORNAMENT_API_KEY,
      Authorization: `Bearer ${await tokenInst.getToken()}`,
      Range: "groups=0-49",
    },
  };

  try {
    let response = await axios.get(url, config);

    cache.set(
      `groups-${process.env.TOORNAMENT_ID}`,
      new CacheObject(response.data)
    );

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function fetchGroupsFromStage(sId) {
  let cachedGroupsofStage = cache.get(`groups-from-stage-${sId}`);

  if (cachedGroupsofStage != null) {
    return cachedGroupsofStage.getData();
  }

  const url = `https://api.toornament.com/organizer/v2/groups?tournament_ids=${process.env.TOORNAMENT_ID}&stage_ids=${sId}`;
  const config = {
    headers: {
      "X-Api-Key": process.env.TOORNAMENT_API_KEY,
      Authorization: `Bearer ${await tokenInst.getToken()}`,
      Range: "groups=0-49",
    },
  };

  try {
    let response = await axios.get(url, config);

    cache.set(`groups-from-stage-${sId}`, new CacheObject(response.data));

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function fetchRoundsOfGroups(gIds) {
  let rounds = [];
  let gRoundIdUncached = [];

  gIds.forEach((id) => {
    let cached = cache.get(`group-rounds-${id}`);

    if (cached != null) {
      cached.getData().forEach((cr) => {
        rounds.push(cr);
      });
    } else {
      gRoundIdUncached.push(id);
    }
  });

  if (gRoundIdUncached.length > 0) {
    const url = `https://api.toornament.com/organizer/v2/rounds?tournament_ids=${process.env.TOORNAMENT_ID}&?group_ids=${gRoundIdUncached}`;
    const config = {
      headers: {
        "X-Api-Key": process.env.TOORNAMENT_API_KEY,
        Authorization: `Bearer ${await tokenInst.getToken()}`,
        Range: "rounds=0-49",
      },
    };

    try {
      let response = await axios.get(url, config);

      let gRoundToCache = []

      response.data.forEach(rd => {
        let gToPush = gRoundToCache.find(({gId}) => gId == rd.group_id)

        if(gToPush != undefined){
            gToPush.rds.push(rd)
        } else {
            gRoundToCache.push({
                gId: rd.group_id,
                rds: [rd]
            })
        }

        rounds.push(rd)
      })

      gRoundToCache.forEach(gRTC => {
        cache.set(`group-rounds-${gRTC.gId}`, new CacheObject(gRTC.rds))
      })

    } catch (err) {
      throw err;
    }
  }

  return rounds
}

module.exports = {
  fetchStages,
  fetchGroups,
  fetchRoundsOfGroups,
  fetchGroupsFromStage,
};
