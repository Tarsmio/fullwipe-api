const Message = require("../models/Message");
const { getIO } = require("../socket");

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

  if (!title || !content)
    return res.status(400).json({
      message: "Corp de requete invalide !",
    });

  let messageToCreate = new Message({
    title: title,
    content: content,
    creation: Date.now(),
  });

  try {
    let createdMessage = await messageToCreate.save();

    getIO().emit("message", {
      id: createdMessage._id,
      title: createdMessage.title,
      content: createdMessage.content,
      creation: createdMessage.creation,
    });

    res.status(201).json({
      message: createdMessage,
      msg: "Message envoyer",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne !" });
  }
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

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
};
