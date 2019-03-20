const mongoose = require("mongoose");
const { mongoURI } = require("../config/keys");
mongoose.set("debug", true);
mongoose.Promise = Promise;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  keepAlive: true,
  useCreateIndex: true
});

module.exports.User = require("./user");
module.exports.Message = require("./message");
