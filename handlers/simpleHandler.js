// Dependencies 

// Simple Handler Object 
const routeHandler = {};

routeHandler.simpleHandler = (reqProps, callback) => {
    
    callback(200,{
        message : "hello world"
    })
};

module.exports = routeHandler;