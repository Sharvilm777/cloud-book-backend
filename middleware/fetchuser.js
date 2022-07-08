const jwt = require("jsonwebtoken");
const JWT_SECRET_TOKEN = "ThisismysecretToken$143";

//This is a middle ware is a function which takes a req,res and next
//next will be a function atlast we will call the next function that has to run
const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to request object
  // we will send the auth-token in headers
  // we will get the auth-token from the header and we will append that to request body object so that we can verify the user
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Please auth with vaild token");
  } else {
    try {
      const data = jwt.verify(token, JWT_SECRET_TOKEN);
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).json("Please auth with vaild token");
    }
  }
};
module.exports = fetchuser;
