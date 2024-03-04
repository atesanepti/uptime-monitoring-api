// Dependencies
const data = require("../lib/data");
const { jsonParser, unicId } = require("../helpers/utilities");

// Simple Handler Object
const routeHandler = {};

routeHandler.tokenHandler = (reqProps, callback) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  const userMethod = reqProps.method.toLowerCase();

  if (acceptMethods.indexOf(userMethod) == -1) {
    callback(405, "Bad Request");
  } else {
    routeHandler.token[userMethod](reqProps, callback);
  }
};

routeHandler.token = {};

routeHandler.token.get = (reqProps, callback) => {
  const id =
    typeof reqProps.queryString.id === "string" &&
    reqProps.queryString.id.trim().length <= 20
      ? reqProps.queryString.id
      : false;
  if (id) {
    data.read("token", id, (error, userToken) => {
      if (!error) {
        const parsedUserToken = { ...jsonParser(userToken) };
        callback(200, parsedUserToken);
      } else {
        callback(500, { message: "The user not exist" });
      }
    });
  } else {
    callback(500, { message: "wrong request" });
  }
};

routeHandler.token.post = (reqProps, callback) => {
  const phone =
    typeof reqProps.body.phone === "string" &&
    reqProps.body.phone.trim().length === 11
      ? reqProps.body.phone
      : false;

  const password =
    typeof reqProps.body.password === "string" &&
    reqProps.body.password.length > 4
      ? reqProps.body.password
      : false;

  if (phone && password) {
    data.read("form_data", phone, (error, token) => {
      if (!error && token) {
        const parsedUser = { ...jsonParser(token) };
        if (parsedUser.password === password) {
          const tokenId = unicId(20);
          const expires = Date.now() + 60 * 60 * 1000;

          const tokenObj = {
            id: tokenId,
            phone,
            expires,
          };
          // Create a new token for the token
          data.create("token", tokenId, tokenObj, (error) => {
            if (!error) {
              callback(200, { message: "token created" });
            } else {
              callback(500, {
                message: "there was a problem in the server side",
              });
            }
          });
        } else {
          callback(400, { message: "invalid password!" });
        }
      } else {
        callback(400, { message: "the token not exist" });
      }
    });
  } else {
    callback(400, { message: "you have a problem in your request" });
  }
};

routeHandler.token.put = (reqProps, callback) => {
  const id =
    typeof reqProps.body.id === "string" && reqProps.body.id.trim().length <= 20
      ? reqProps.body.id
      : false;
  const extend =
    typeof reqProps.body.extend === "boolean" ? reqProps.body.extend : false;
  if (id && extend) {
    data.read("token", id, (error, userToken) => {
      if (!error && userToken) {
        const parsedUserToken = { ...jsonParser(userToken) };
        if (parsedUserToken.expires > Date.now()) {
          parsedUserToken.expires = Date.now() + 60 * 60 * 1000;

          data.update("token", id, parsedUserToken, (error) => {
            if (!error) {
              callback(200, { message: "token updated" });
            } else {
              callback(500, {
                message: "there was a problem in the server side",
              });
            }
          });
        } else {
          callback(400, { message: "the token already expires" });
        }
      } else {
        callback(400, { message: "token not create yet" });
      }
    });
  } else {
    callback(400, { message: "enter correct phone number" });
  }
};

routeHandler.token.delete = (reqProps, callback) => {
  const id =
    typeof reqProps.queryString.id === "string" &&
    reqProps.queryString.id.trim().length <= 20
      ? reqProps.queryString.id
      : false;
  if (id) {
    data.delete("token", id, (error) => {
      if (!error) {
        callback(200, { message: `token deleted` });
      } else {
        callback(500, { message: "token not create yet" });
      }
    });
  } else {
    callback(400, { message: "Enter valid token id" });
  }
};

routeHandler.token.verify = (id, phone, callback) => {
  data.read("token", id, (error, userToken) => {
    if (!error && userToken) {
      const parsedUserToken = { ...jsonParser(userToken) };
      if (phone === parsedUserToken.phone) {
        callback(true, userToken);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = routeHandler;
