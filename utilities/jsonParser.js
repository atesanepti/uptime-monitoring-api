// Dependencies

// Parser Object
const parser = {};

parser.jsonParser = (jsonString) => {
  let body;
  try {
    body = JSON.parse(jsonString);
  } catch {
    body = {};
  }
  return body;
};



module.exports = parser;