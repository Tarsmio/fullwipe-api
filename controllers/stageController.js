const { stages } = require("../data/map-pool.json")
const { maps, modes } = require("../data/maps-modes-data.json")

/*return res.status(501).json({
    message: "Route non implementé"
})*/

async function getStages(req, res, next) {
    let stagesObject = {stages : []}

    stages.forEach(s => {
        let stageObject = {}

        stageObject.stage_id = s.id
        stageObject.stage_name = s.name
        stageObject.rounds = []

        s.rounds.forEach(r => {
            let roundObject = {}

            roundObject.id = r.id
            roundObject.round_name = r.name
            roundObject.sets = []

            r.set.forEach(se => {
                let setObject = {}

                setObject.map = maps.find(({id}) => id == se.map)
                setObject.mode = modes.find(({id}) => id == se.mode)

                roundObject.sets.push(setObject)
            })

            stageObject.rounds.push(roundObject)
        })

        stagesObject.stages.push(stageObject)
    })

    return res.status(200).json(stagesObject)
}

module.exports = {
    getStages
}