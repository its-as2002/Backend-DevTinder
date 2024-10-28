const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();

//This api will send the pending connection request to the LoggedInUser
userRouter.get("/requests/recieved", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequest = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
		});
		res.status(400).json({
			message: `Hey ${loggedInUser.firstName}!,You have got ${connectionRequest.length} pending requests`,
			data: connectionRequest,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});
module.exports = userRouter;
