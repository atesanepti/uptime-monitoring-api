// Dependencies
const data = require("../lib/data");
const { jsonParser } = require("../helpers/utilities");
const { token } = require("./token.handler");

// Simple Handler Object
const routeHandler = {};

routeHandler.userHandler = (reqProps, callback) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  const userMethod = reqProps.method.toLowerCase();

  if (acceptMethods.indexOf(userMethod) == -1) {
    callback(405, "Bad Request");
  } else {
    routeHandler.user[userMethod](reqProps, callback);
  }
};

routeHandler.user = {};

routeHandler.user.get = (reqProps, callback) => {
  const phone =
    typeof reqProps.queryString.phone === "string" &&
    reqProps.queryString.phone.trim().length === 11
      ? reqProps.queryString.phone
      : false;
  if (phone) {
    const id = reqProps.headers.id;
    token.verify(id,phone, (tokenId) => {
      if (tokenId) {
        data.read("form_data", `${phone}`, (error, user) => {
          if (!error) {
            const parsedUser = { ...jsonParser(user) };
            delete parsedUser.password;
            callback(200, parsedUser);
          } else {
            callback(500, { message: "The use not exist" });
          }
        });
      } else {
        callback(402, { message: "authentication filed!" });
      }
    });
  } else {
    callback(500, { message: "wrong request" });
  }
};

routeHandler.user.post = (reqProps, callback) => {
  const firstName =
    typeof reqProps.body.firstName === "string" &&
    reqProps.body.firstName.trim().length > 0
      ? reqProps.body.firstName
      : false;

  const lastName =
    typeof reqProps.body.lastName === "string" &&
    reqProps.body.lastName.trim().length > 0
      ? reqProps.body.lastName
      : false;

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

  const toAgreement =
    typeof reqProps.body.toAgreement === "boolean"
      ? reqProps.body.toAgreement
      : false;

  if (firstName && lastName && phone && password && toAgreement) {
    const user = {
      firstName,
      lastName,
      phone,
      password,
      toAgreement,
    };
    data.create("form_data", `${phone}`, user, (error) => {
      if (!error) {
        callback(200, { message: "Your information have added" });
      } else {
        callback(500, { message: "The user have already created!" });
      }
    });
  } else {
    callback(400, { message: "You hava a probleam in your request" });
  }
};

routeHandler.user.put = (reqProps, callback) => {
  const phone =
    typeof reqProps.body.phone === "string" &&
    reqProps.body.phone.trim().length === 11
      ? reqProps.body.phone
      : false;
  const firstName =
    typeof reqProps.body.firstName === "string" &&
    reqProps.body.firstName.trim().length > 0
      ? reqProps.body.firstName
      : false;

  const lastName =
    typeof reqProps.body.lastName === "string" &&
    reqProps.body.lastName.trim().length > 0
      ? reqProps.body.lastName
      : false;
  const password =
    typeof reqProps.body.password === "string" &&
    reqProps.body.password.length > 4
      ? reqProps.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const id = reqProps.headers.id;
      token.verify(id,phone, (tokenId) => {
        if (tokenId) {
          data.read("form_data", `${phone}`, (error, user) => {
            if (!error) {
              const parsedUser = { ...jsonParser(user) };
              if (firstName) {
                parsedUser.firstName = firstName;
              }
              if (lastName) {
                parsedUser.lastName = lastName;
              }
              if (password) {
                parsedUser.password = password;
              }

              data.update("form_data", `${phone}`, parsedUser, (error) => {
                if (!error) {
                  callback(200, { message: "your data have updated" });
                } else {
                  callback(500, { message: `${error.message}` });
                }
              });
            } else {
              callback(500, { message: error.message });
            }
          });
        } else {
          callback(402, { message: "authentication filed" });
        }
      });
    } else {
      callback(400, {
        message: "please send your data that you want to update",
      });
    }
  } else {
    callback(400, { message: "enter correct phone number" });
  }
};

routeHandler.user.delete = (reqProps, callback) => {
  const phone =
    typeof reqProps.queryString.phone === "string" &&
    reqProps.queryString.phone.trim().length === 11
      ? reqProps.queryString.phone
      : false;
  if (phone) {
    const id = reqProps.headers.id;
    token.verify(id,phone, (tokenId) => {
      if (tokenId) {
        data.delete("form_data", `${phone}`, (error) => {
          if (!error) {
            callback(200, { message: `${phone} : user deleted` });
          } else {
            callback(500, { message: error.message });
          }
        });
      } else {
        callback(402, { message: "authentication filed" });
      }
    });
  } else {
    callback(400, { message: "Enter valid user phone" });
  }
};

module.exports = routeHandler;
