// Dependencies

// Parser Object
const utilities = {};

utilities.jsonParser = (jsonString) => {
  let body;
  try {
    body = JSON.parse(jsonString);
  } catch {
    body = {};
  }
  return body;
};

utilities.unicId = (length) => {
  length = typeof length === "number" && length > 7 ? length : 7;
  const char = "abcdefghtjklmnopqrstuvwxyz0123456789";
  let unicId = "";
  for(let i = 0; i < length; i++){
    const randomNumber = Math.round(Math.random() * char.length - 1);
    unicId += char.charAt(randomNumber);
  }
  return unicId;
};

module.exports = utilities;
