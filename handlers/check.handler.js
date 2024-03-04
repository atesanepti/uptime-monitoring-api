// Dependencies
const data = require("../lib/data");
const { jsonParser, unicId } = require("../helpers/utilities");
const { token } = require("./token.handler");

// Simple Handler Object
const routeHandler = {};

routeHandler.checkHandler = (reqProps, callback) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  const userMethod = reqProps.method.toLowerCase();

  if (acceptMethods.indexOf(userMethod) == -1) {
    callback(405, "Bad Request");
  } else {
    routeHandler.check[userMethod](reqProps, callback);
  }
};

routeHandler.check = {};

routeHandler.check.get = (reqProps, callback) => {
  const id =
    typeof reqProps.queryString.id === "string" &&
    reqProps.queryString.id.trim().length <= 20
      ? reqProps.queryString.id
      : false;

  if (id) {
    data.read("checks", id, (error, userChceks) => {
      const parsedUserChecks = { ...jsonParser(userChceks) };
      const userPhone = parsedUserChecks.userPhone;
      const tokenId = reqProps.headers.token;
      if (!error && userChceks) {
        token.verify(tokenId, userPhone, (userTokenId) => {
          if (userTokenId) {
            callback(200, parsedUserChecks);
          } else {
            callback(403, { message: "authentication filed!" });
          }
        });
      } else {
        callback(500, { message: "you hava a problem in your request" });
      }
    });
  } else {
    callback(400, { message: "you hava a problem in your request" });
  }
};

routeHandler.check.post = (reqProps, callback) => {
  const protocal =
    typeof reqProps.body.protocal === "string" &&
    reqProps.body.protocal.trim().length > 1 &&
    ["http", "https"].indexOf(reqProps.body.protocal) !== -1
      ? reqProps.body.protocal
      : false;
  const url =
    typeof reqProps.body.url === "string" && reqProps.body.url.trim().length > 1
      ? reqProps.body.url
      : false;
  const method =
    typeof reqProps.body.method === "string" &&
    reqProps.body.method.trim().length > 1 &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqProps.body.method) !== -1
      ? reqProps.body.method
      : false;
  const successCodes =
    typeof reqProps.body.successCodes === "object" &&
    reqProps.body.successCodes instanceof Array
      ? reqProps.body.successCodes
      : false;
  const timeout =
    typeof reqProps.body.timeout === "number" &&
    reqProps.body.timeout % 1 === 0 &&
    reqProps.body.timeout >= 1 &&
    reqProps.body.timeout <= 5
      ? reqProps.body.timeout
      : false;

  const tokenId = reqProps.headers.token;
  if (protocal && url && method && successCodes && timeout) {
    data.read("token", tokenId, (error, userToken) => {
      if (!error && userToken) {
        const parsedUserToken = { ...jsonParser(userToken) };
        const userPhone = parsedUserToken.phone;
        data.read("form_data", userPhone, (error, user) => {
          const parsedUser = { ...jsonParser(user) };
          if (!error && user) {
            token.verify(tokenId, userPhone, (userTokenId) => {
              if (userTokenId) {
                const userChecks =
                  typeof parsedUser.checks === "object" &&
                  parsedUser.checks instanceof Array
                    ? parsedUser.checks
                    : [];
                if (userChecks.length < 5) {
                  const checkId = unicId(20);
                  userChecks.push(checkId);
                  const checkObj = {
                    id: checkId,
                    userPhone,
                    protocal,
                    url,
                    method,
                    successCodes,
                    timeout,
                  };
                  data.create("checks", checkId, checkObj, (error) => {
                    if (!error) {
                      parsedUser.checks = userChecks;
                      data.update(
                        "form_data",
                        userPhone,
                        parsedUser,
                        (error) => {
                          if (!error) {
                            callback(200, { message: "check created" });
                          } else {
                            callback(500, {
                              message:
                                "there have a problem in the server side",
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        message: "there have a problem in the server side",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    message: "user already reached max check limit",
                  });
                }
              } else {
                callback(403, { message: "token expires" });
              }
            });
          } else {
            callback(403, { message: "user not exist" });
          }
        });
      } else {
        callback(403, { message: "authentication filed!" });
      }
    });
  } else {
    callback(400, { message: "you have a problem in your request" });
  }
};

routeHandler.check.put = (reqProps, callback) => {
  const protocal =
    typeof reqProps.body.protocal === "string" &&
    reqProps.body.protocal.trim().length > 1 &&
    ["http", "https"].indexOf(reqProps.body.protocal) !== -1
      ? reqProps.body.protocal
      : false;
  const url =
    typeof reqProps.body.url === "string" && reqProps.body.url.trim().length > 1
      ? reqProps.body.url
      : false;
  const method =
    typeof reqProps.body.method === "string" &&
    reqProps.body.method.trim().length > 1 &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqProps.body.method) !== -1
      ? reqProps.body.method
      : false;
  const successCodes =
    typeof reqProps.body.successCodes === "object" &&
    reqProps.body.successCodes instanceof Array
      ? reqProps.body.successCodes
      : false;
  const timeout =
    typeof reqProps.body.timeout === "number" &&
    reqProps.body.timeout % 1 === 0 &&
    reqProps.body.timeout >= 1 &&
    reqProps.body.timeout <= 5
      ? reqProps.body.timeout
      : false;
  const checkId =
    typeof reqProps.queryString.id === "string" &&
    reqProps.queryString.id.trim().length <= 20
      ? reqProps.queryString.id
      : false;
  const tokenId = reqProps.headers.token;
  if (checkId) {
    if (protocal || url || method || successCodes || timeout) {
      data.read("checks", checkId, (error, checkData) => {
        if (!error && checkData) {
          const parsedCheckData = { ...jsonParser(checkData) };
          const phone = parsedCheckData.userPhone;
          console.log(phone);
          token.verify(tokenId, phone, (userTokenId) => {
            if (userTokenId) {
              if (protocal) {
                parsedCheckData.protocal = protocal;
              }
              if (url) {
                parsedCheckData.url = url;
              }
              if (method) {
                parsedCheckData.method = method;
              }
              if (successCodes) {
                parsedCheckData.successCodes = successCodes;
              }
              if (timeout) {
                parsedCheckData.timeout = timeout;
              }
              data.update("checks", checkId, parsedCheckData, (error) => {
                if (!error) {
                  callback(200, { message: "check data successfully updated" });
                } else {
                  callback(500, {
                    message: "there was a problem in the server side",
                  });
                }
              });
            } else {
              callback(403, { message: "authentication filed!" });
            }
          });
        } else {
          callback(402, { message: "check not found!" });
        }
      });
    } else {
      callback(402, { message: "you have a problem in your request" });
    }
  } else {
    callback(402, { message: "you have a problem in your request" });
  }
};

routeHandler.check.delete = (reqProps, callback) => {
  const checkId =
    typeof reqProps.queryString.id === "string" &&
    reqProps.queryString.id.trim().length <= 20
      ? reqProps.queryString.id
      : false;
  const tokenId = reqProps.headers.token;

  if (checkId) {
    data.read("checks", checkId, (error, checkData) => {
      if (!error && checkData) {
        const parsedCheckData = { ...jsonParser(checkData) };
        const phone = parsedCheckData.userPhone
        token.verify(tokenId, phone, (userTokenId) => {
          if (userTokenId) {
            data.delete("checks", checkId, (error) => {
              if (!error) {
                data.read("form_data", phone, (error, user) => {
                  if (!error && user) {
                    const parsedUser = { ...jsonParser(user) };
                    const checks = parsedUser["checks"];
                    const currentCheckIndex = checks.indexOf(checkId);
                    if (currentCheckIndex !== 1) {
                      checks.splice(currentCheckIndex, 1);
                      parsedUser.checks = checks;

                      data.update("form_data", phone, parsedUser, (error) => {
                        if (!error) {
                          callback(200, { message: "check deleted" });
                        } else {
                          callback(500, {
                            message: "there was an error in the server side",
                          });
                        }
                      });
                    } else {
                      callback(402, { message: "check not found" });
                    }
                  } else {
                    callback(500, {
                      message: "there was an error in the server side",
                    });
                  }
                });
              } else {
                callback(500, {
                  message: "there was an error in the server side",
                });
              }
            });
          } else {
            callback(403, { message: "authentication filed" });
          }
        });
      } else {
        callback(402, { message: "you have a problem in your request" });
      }
    });
  } else {
    callback(402, { message: "you have a problem in your request" });
  }
};

module.exports = routeHandler;
