async function getMaps(req, res, next) {
    return res.status(501).json({
        message: "Route non implementé"
    })
}

module.exports = {
    getMaps
}