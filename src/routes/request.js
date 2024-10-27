const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");
const mongoose = require("mongoose");

const requestRouter = express.Router();
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const fromUserId = loggedInUser._id;
		const toUserId = req.params.toUserId;
		const status = req.params.status;

		//check Valid ObjectId
		if (
			!mongoose.Types.ObjectId.isValid(fromUserId) ||
			!mongoose.Types.ObjectId.isValid(toUserId)
		)
			return res.json({
				message: "Invalid userId type",
			});

		//check valid status
		if (!(status in { interested: "interested", ignored: "ignored" })) {
			return res.status(400).json({
				message: "Invalid status type : " + status,
			});
		}

		//check that the user exists to whom request is being sent
		const toUser = await User.findById(toUserId);
		if (!toUser)
			return res.status(404).send("You are sending request to a invalid user");

		//check for duplicatie connection request or check that the request from same user already exists to whom the request is being sent by the loggedIn user.
		const checkExistingRequest = await ConnectionRequestModel.findOne({
			$or: [
				{ fromUserId, toUserId },
				{ fromUserId: toUserId, toUserId: fromUserId },
			],
		});
		if (checkExistingRequest)
			return res.json({ message: "Connection Request already Exist" });

		//Add request to db
		const connectionData = {
			fromUserId,
			toUserId,
			status,
		};

		const connectionRequest = new ConnectionRequestModel(connectionData);
		const data = await connectionRequest.save();
		res.json({
			message: `Hey ${loggedInUser.firstName}! Your Connection request was successfully sent to ${toUser.firstName}`,
			data,
		});
	} catch (err) {
		res.status(404).send("Error : " + err.message);
	}
});

module.exports = requestRouter;
