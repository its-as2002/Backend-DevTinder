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

		//check for duplicatie connection request from LoggedIn User
		const checkExistingRequestFromLoggedInUser =
			await ConnectionRequestModel.findOne({
				fromUserId,
				toUserId,
			});
		if (checkExistingRequestFromLoggedInUser) {
			if (checkExistingRequestFromLoggedInUser.status === "interested")
				return res.json({
					message: `Hey ${loggedInUser.firstName}!! You already sent a connection request to ${toUser.firstName}`,
					data: checkExistingRequestFromLoggedInUser,
				});
			else if (checkExistingRequestFromLoggedInUser.status === "ignored")
				return res.json({
					message: `Hey ${loggedInUser.firstName}!! You are already ignored ${toUser.firstName}`,
					data: checkExistingRequestFromLoggedInUser,
				});
			else if (checkExistingRequestFromLoggedInUser.status === "accepted")
				return res.json({
					message: `Hey ${loggedInUser.firstName}!! You and ${toUser.firstName} are already friends`,
					data: checkExistingRequestFromLoggedInUser,
				});
		}

		//check that the connection request of other user already exists to whom the request is being sent by the loggedIn user.
		const checkExistingRequestFromOtherUser =
			await ConnectionRequestModel.findOne({
				fromUserId: toUserId,
				toUserId: fromUserId,
			});
		if (checkExistingRequestFromOtherUser)
			if (checkExistingRequestFromOtherUser.status === "interested")
				return res.status(500).json({
					message: `Hey ${loggedInUser.firstName}!! ${toUser.firstName} has already sent a connection request to you.`,
					data: checkExistingRequestFromOtherUser,
				});
			else if (checkExistingRequestFromOtherUser.status === "ignored")
				return res.status(500).json({
					message: `Hey ${loggedInUser.firstName}!! ${toUser.firstName} has ignored your profile`,
					data: checkExistingRequestFromOtherUser,
				});
			else if (checkExistingRequestFromOtherUser.status === "accepted")
				return res.status(500).json({
					message: `Hey ${loggedInUser.firstName}!! You and ${toUser.firstName} are already friends`,
					data: checkExistingRequestFromOtherUser,
				});
			else {
				throw new Error("Invalid status from db check for error");
			}

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

requestRouter.post("/view/:status/:requestId", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const { status, requestId } = req.params;

		if (!(status in { accepted: "accepted", rejected: "rejected" }))
			return res.status(400).json({ message: "Invalid status " + status });
		if (!mongoose.Types.ObjectId.isValid(requestId))
			return res.status(400).json({ message: "Invalid requestId" });

		const connectionRequest = await ConnectionRequestModel.findOne({
			_id: requestId,
			toUserId: loggedInUser._id,
			status: "interested",
		});
		if (!connectionRequest)
			return res
				.status(404)
				.json({ message: "Connection request doesn't exist" });
		connectionRequest.status = status;
		await ConnectionRequestModel.findOneAndDelete({ _id: requestId });
		res.json({
			message: `Hey ${loggedInUser.firstName}!! You ${status} the connection request`,
		});
	} catch (err) {
		res.status(404).send("Error : " + err.message);
	}
});

module.exports = requestRouter;
