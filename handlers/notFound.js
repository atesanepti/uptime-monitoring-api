// Dependencies

// Simple Handler Object
const routeHandler = {};

routeHandler.notFound = (reqProps, callback) => {
    callback(404,{
        message : "error"
    })
};

module.exports = routeHandler;
