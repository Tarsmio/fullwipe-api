const { fetchGroupsFromStage } = require("../utils/toornamentTools")

async function getGroupsListId(req, res, next) {
    try {
        let groupsData = await fetchGroupsFromStage(process.env.GROUP_STAGE)

        let sortedGroups = groupsData.sort((a, b) => a.number - b.number)

        res.status(200).json(sortedGroups.map(({id}) => id))
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message : "Erreur interne !"
        })
    }
}

async function getGroup(req, res, next){
    let objectToReturn = {
        id: req.group.id,
        name: req.group.name,
        number: req.group.number,
        settings: {
            size: req.group.settings.size
        },
        participants: []
    }

    req.ranking.forEach(rank => {
        objectToReturn.participants.push(rank.participant.id)
    });

    res.status(200).json(objectToReturn)
}

module.exports = {
    getGroupsListId,
    getGroup
}