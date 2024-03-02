// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFound } = require("../handlers/notFound");
const { jsonParser } = require("./utilities");

// Handler Objects
const handler = {};

// Handler Request and Response
handler.handleReqRes = (req, res) => {
  // Get Requested Url info
  const paresedUrl = url.parse(req.url, true);
  const path = paresedUrl.pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryString = paresedUrl.query;
  const headers = req.headers;

  const reqProps = {
    paresedUrl,
    path,
    method,
    queryString,
    headers,
  };

  // Find route
  const routeHandler = routes[path] ? routes[path] : notFound;

  const decoder = new StringDecoder("utf-8");

  // Posted data get
  let body = "";
  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });

  req.on("end", () => {
    body += decoder.end();
    const parsedBody = jsonParser(body);
    reqProps.body = parsedBody;
    routeHandler(reqProps, (status, payload) => {
      status = typeof status === "number" ? status : 404;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.writeHead(status);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
