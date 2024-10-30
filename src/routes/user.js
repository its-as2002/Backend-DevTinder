const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "about", "skills"];
const mongoose = require("mongoose");
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

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		let limit = parseInt(req.query.limit) || 2;
		if (limit < 1 || limit > 10) limit = 2;
		const page = parseInt(req.query.page) || 1;
		// user should not see
		//-his own profile
		//-his connection ,Status - accepted
		//-people who sent connection request to user and vice-versa, Status - interested
		//-people who are ignored, Status - ignored
		const connectionRequest = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select("fromUserId toUserId");

		const userNotToBeShownOnFeed = {}; // can use myMap or Set also ,just remember that logical operator need array of objectId not string of objectid.

		connectionRequest.forEach((request) => {
			userNotToBeShownOnFeed[request.fromUserId] = true;
			userNotToBeShownOnFeed[request.toUserId] = true;
		});

		const filteredUser = await User.find({
			$and: [
				{
					_id: {
						$nin: Object.keys(userNotToBeShownOnFeed).map(
							(id) => new mongoose.Types.ObjectId(id)
						),
					},
				},
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFE_DATA)
			.skip((page - 1) * limit)
			.limit(limit);

		res.json({
			message: `Hey ${loggedInUser.firstName}! There are ${filteredUser.length} users on you feed`,
			data: filteredUser,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

module.exports = userRouter;
