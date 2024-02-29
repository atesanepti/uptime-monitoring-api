// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const data = require("./lib/data");
// App Object
const app = {};

// Configurations
app.config = {
  PORT: process.env.PORT || 6000,
};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.PORT, (error) => {
    if (!error) {
      console.log(`Server Is Running at ${app.config.PORT}`);
    } else {
      console.log(error);
    }
  });
};

// Request And Response Handler
app.handleReqRes = handleReqRes;

// Start The Server
app.createServer();

