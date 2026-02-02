async function getMatch(req, res, next) {
    res.status(200).json(req.match)
}

module.exports = {
    getMatch
}