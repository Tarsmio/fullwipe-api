function teamParse(toornamentTeam) {
    let teamObject = {
        team_id : toornamentTeam.id,
        logo : toornamentTeam.logo,
        created_at : toornamentTeam.created_at,
        name: toornamentTeam.name,
        discord_cap : toornamentTeam.custom_fields.identifiant_discord_du_capitaine,
        lineup: []
    }

    toornamentTeam.lineup.forEach(player => {
        let playerObject = {
            name: player.name,
            discord: player.custom_fields.identifiant_discord_du_joueur
        }

        teamObject.lineup.push(playerObject)
    })

    return teamObject
}

module.exports = {
    teamParse
}