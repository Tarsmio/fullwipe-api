const logger = require("../logger");
const Message = require("../models/Message");
const Subscription = require("../models/Subscription");
const { getIO } = require("../socket");
const webpush = require("web-push");

async function getMessages(req, res, next) {
  try {
    let msgs = await Message.find();

    let toSend = [];

    msgs.forEach((msg) => {
      let objSend = {
        id: msg._id,
        title: msg.title,
        content: msg.content,
        creation: msg.creation,
      };

      toSend.push(objSend);
    });

    res.status(200).json({
      messages: toSend,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur interne !" });
  }
}

async function sendMessage(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  const open = req.body.open

  if (!title || !content || !open)
    return res.status(400).json({
      message: "Corp de requete invalide !",
    });

  let messageToCreate = new Message({
    title: title,
    content: content,
    creation: Date.now(),
  });

  let createdMessage;

  try {
    createdMessage = await messageToCreate.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne !" });
  }

  try {
    await getIO().emit("message", {
      id: createdMessage._id,
      title: createdMessage.title,
      content: createdMessage.content,
      creation: createdMessage.creation,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne !" });
  }

  try {
    let subs = await Subscription.find();

    let payloadToSend = JSON.stringify({
      title: createdMessage.title,
      body: createdMessage.content,
      url: open
    });

    subs.forEach((subObj) => {
      webpush
        .sendNotification(subObj.sub, payloadToSend)
        .then(() => {
          logger.info(`Notification envoyé a ${subObj._id}`);
        })
        .catch((err) => {
          logger.error("Erreur lors d'envoi de notif", err);
          if (err.statusCode == 410) {
            Subscription.deleteOne({ _id: subObj._id })
              .then(() => {
                logger.info(`Subscription ${subObj._id} supprimer`);
              })
              .catch((err) => {
                logger.error(
                  `Erreur lors de la suppression de la soubscription ${subObj._id}`
                );
              });
          }
        });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne !" });
  }

  res.status(201).json({
    id: createdMessage._id,
    title: createdMessage.title,
    content: createdMessage.content,
    creation: createdMessage.creation
  });
}

async function deleteMessage(req, res, next) {
  let msgID = req.message.id;

  try {
    let result = await Message.deleteOne({ _id: msgID });

    if (!(result.acknowledged === true && result.deletedCount > 0)) {
      throw new Error("Message non effacé");
    }

    getIO().emit("info-delete", {
      id: msgID,
    });

    return res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne !" });
  }
}

async function saveSub(req, res, next) {
  if (!req.body)
    return res.status(400).json({
      message: "Body invalide",
    });

  const sub = req.body.subscription;
  const endp = req.body.endpoint;

  if (!sub || !endp)
    return res.status(400).json({
      message: "Body invalide",
    });

  let savedObj;

  try {
    savedObj = await Subscription.findOneAndUpdate(
      { endpoint: endp },
      {
        endpoint: endp,
        sub: sub,
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Erreur interne",
    });
  }

  return res.status(201).json({
    sub: {
      id: savedObj._id,
      sub: savedObj.sub,
      endpoint: savedObj.endpoint,
    },
  });
}

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
  saveSub,
};
