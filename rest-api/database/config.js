const mongoose = require("mongoose");
const dbConnection = async () => {
  // var atlas = 'mongodb://52.15.124.164:27018/monitor'
  var db = "mongodb://mongo:27017/mqtt";
  try {
    await mongoose.connect(db);
    console.log("BD Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la BD ver logs");
  }
};

module.exports = {
  dbConnection,
};
