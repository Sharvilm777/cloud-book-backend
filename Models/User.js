const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  //Here we dont have to call that function like Date.now() Because it will run itself when the new instance is creating by using this schema
});
const User = mongoose.model("user", UserSchema);
// User.createIndexes();
//We can Create the index of unique value entries which will keep track of entries
//But we created a Custom checker for unique values in auth.js by using findOne() method of mongoDB Which will return the 1st element which having the value
module.exports = User;
