// Dependencies
const {simpleHandler} = require("./handlers/simpleHandler");
const {userHandler} = require("./handlers/user.handler")
const {tokenHandler} = require("./handlers/token.handler")


// Routes Object
const routes = {
  simple: simpleHandler,
  user: userHandler,
  token : tokenHandler
};

module.exports = routes;