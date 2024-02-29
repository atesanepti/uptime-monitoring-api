// Dependencices
const fs = require("fs");
const path = require("path");

const data = {};

// Create a new file
data.create = (dirName, fileName, data, callback) => {
  const baseDir = path.join(__dirname, ".././data/");
  fs.open(`${baseDir + dirName}/${fileName}.json`, "wx", (error, file) => {
    if (!error && file) {
      const dataJson = JSON.stringify(data);
      fs.writeFile(file, dataJson, (error) => {
        if (!error) {
          fs.close(file, (error) => {
            if (!error) {
              callback(false);
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      });
    } else {
      callback(error);
    }
  });
};

// Read file
data.read = (dirName, fileName, callback) => {
  const baseDir = path.join(__dirname, ".././data/");
  fs.readFile(
    `${baseDir + dirName}/${fileName}.json`,
    "utf8",
    (error, data) => {
      callback(error, data);
    }
  );
};

// Update file
data.update = (dirName, fileName, data, callback) => {
  const baseDir = path.join(__dirname, ".././data/");
  const file = `${baseDir + dirName}/${fileName}.json`;
  console.log(file);
  if (fs.existsSync(file)) {
    const dataString = JSON.stringify(data);
    fs.writeFile(file, dataString, (error) => {
      if (!error) {
        callback(false);
      } else {
        callback(error);
      }
    });
  } else {
    callback(new Error(`${file} file was not found`));
  }
};

// Delete file
data.delete = (dirName, fileName, callback) => {
  const baseDir = path.join(__dirname, ".././data/");
  const file = `${baseDir + dirName}/${fileName}.json`;
  fs.unlink(file, (error) => {
    if (!error) {
      callback(false);
    } else {
      callback(error);
    }
  });
};
module.exports = data;
