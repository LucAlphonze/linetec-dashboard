require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");

const dbConnection = async () => {
  console.log(
    "user: ",
    process.env.MONGO_INITDB_ROOT_USERNAME,
    "pass: ",
    process.env.MONGO_INITDB_ROOT_PASSWORD
  );
  var adminConn = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/mqtt?authMechanism=DEFAULT&authSource=admin`;

  try {
    // await mongoose.connect(db);
    await mongoose.connect(adminConn);
    console.log("BD Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la BD ver los logs");
  }
};

module.exports = {
  dbConnection,
};
