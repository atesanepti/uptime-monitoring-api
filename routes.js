// Dependencies
const { simpleHandler } = require("./handlers/simpleHandler");
const { userHandler } = require("./handlers/user.handler");
const { tokenHandler } = require("./handlers/token.handler");
const { checkHandler } = require("./handlers/check.handler");

// Routes Object
const routes = {
  simple: simpleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
