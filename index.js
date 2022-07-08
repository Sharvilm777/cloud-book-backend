const connection = require("./connectToDB");
const express = require("express");
var cors = require("cors");
connection();

const app = express();
const port = 5000; // Here im using the 5000 port because in 3000 port our react app will be running

//If we want to use body of the request then we have to use the middleware(express.json)here if not then we cant use the Body of the request
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is home page seerving by express server");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/note"));

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
