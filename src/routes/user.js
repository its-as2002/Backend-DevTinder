const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "photoURL"];
//This api will send the pending connection request to the LoggedInUser
userRouter.get("/requests/recieved", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequest = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
			// }).populate("fromUserId", "firstName lastName photoURL");
		}).populate("fromUserId", USER_SAFE_DATA);

		requests = connectionRequest.map((request) => request?.fromUserId);
		res.status(200).json({
			message: `Hey ${loggedInUser.firstName}!,You have got ${connectionRequest.length} pending requests`,
			requests,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

userRouter.get("/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequest = await ConnectionRequest.find({
			$or: [
				{ fromUserId: loggedInUser._id, status: "accepted" },
				{ toUserId: loggedInUser._id, status: "accepted" },
			],
		})
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);

		const connections = connectionRequest.map((request) =>
			loggedInUser._id.equals(request.fromUserId._id)
				? request?.toUserId
				: request?.fromUserId
		);
		res.json({
			message: `Hey ${loggedInUser.firstName}!,You have got ${connectionRequest.length} connections`,
			connections,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

module.exports = userRouter;
