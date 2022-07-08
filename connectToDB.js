const mongoose = require("mongoose");
const collectionName = "notebook";
const URI = `mongodb://localhost:27017/${collectionName}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
//Here we can specify the the collection which we are working on.That will save our data in given collection
const connectToDB = async () => {
  // This is to connect to db by Callback method
  mongoose.connect(URI, () => {
    console.log("Hey We are connected to DB");
  });
  // Or we can connect to db by async and await method also by just doing function as async and the method as await
  //   await mongoose.connect(URI);
  //   console.log("I think we connected to db");
};

module.exports = connectToDB;
