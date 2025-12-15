const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


//@Send connection Api
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
    // sending connection request
    console.log("Sending a connection request");
    

    res.send(user.firstName + "send the connection request!.")

})


module.exports = requestRouter;