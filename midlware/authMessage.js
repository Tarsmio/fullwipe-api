async function authMessage(req, res, next){
    let authKeyHeader = req.headers.authorization

    console.log(authKeyHeader)

    if(!authKeyHeader) {
        return res.status(401).json({
            message: "Aucune clé d'enregistrement message presente dans le header"
        })
    }

    if(authKeyHeader != process.env.MSG_KEY){
        return res.status(401).json({
            message: "Clé d'enregistrement message invalide !"
        })
    }

    next()
}

module.exports = {
    authMessage
}