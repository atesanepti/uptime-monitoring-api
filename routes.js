// Dependencies
const {simpleHandler} = require("./handlers/simpleHandler");
const {userHandler} = require("./handlers/user.handler")

// Routes Object
const routes = {
  simple: simpleHandler,
  user: userHandler,
};

module.exports = routes;