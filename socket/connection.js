const { Socket, Server } = require("socket.io");
const logger = require("../logger");
const Message = require("../models/Message");

/**
 *
 * @param {Socket} socket
 * @param {Server} io
 */
module.exports = async (socket, io) => {
  logger.info(`Nouveau socket : ${socket.id}`)

  let msgs = await Message.find();

  let toSend = []

  msgs.forEach(msg => {
    let objSend = {
      id: msg._id,
      title: msg.title,
      content: msg.content,
      creation: msg.creation
    }

    toSend.push(objSend)
  });

  socket.emit("getting-up", toSend);
};
