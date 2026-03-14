const { isValidObjectId } = require('mongoose')
const Message = require('../models/Message')

async function getMessage(req, res, next){
    let msId = req.params.id

    if(!isValidObjectId(msId)){
        return res.status(400).json({
            message : "Id message invalide !"
        })
    }

    try {
        let message = await Message.findOne({_id: msId})

        if(message == null) return res.status(404).json({
            message: "Message introuvable !"
        })

        req.message = message

        next()
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne !" })
    }
}

module.exports = {
    getMessage
}