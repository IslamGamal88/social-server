const db = require("../models");

// /api/users/:id/messages
exports.createMessage = async function(req, res, next) {
  try {
    // access db and create a message
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    // find attached user
    let foundUser = await db.User.findById(req.params.id);
    // push message to THAT user
    foundUser.messages.push(message.id);
    // have to manually save -_- like what the fuck man
    await foundUser.save();
    // by now the message has been saved successfully
    // so we grab it by the butt and populate user
    let foundMessage = await db.Message.findById(message.id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    // at long fucking last we res.json
    return res.status(200).json(foundMessage);
  } catch (error) {
    return next(error);
  }
};

exports.getMessage = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id);
    return res.status(200).json(foundMessage);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMessage = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    return res.status(200).json(foundMessage);
  } catch (error) {
    return next(error);
  }
};
