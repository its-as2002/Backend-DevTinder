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

		// Validate limit to ensure it's within range
		let limit = parseInt(req.query.limit) || 2;
		limit = Math.min(Math.max(limit, 1), 10); // Keeps limit between 1 and 10

		const page = parseInt(req.query.page) || 1;

		// Fetch connection requests involving the logged-in user
		const connectionRequest = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select("fromUserId toUserId");

		// Use a Set to store IDs of users to hide on the feed for optimized lookups
		const userNotToBeShownOnFeed = new Set();
		connectionRequest.forEach((request) => {
			userNotToBeShownOnFeed.add(request.fromUserId.toString());
			userNotToBeShownOnFeed.add(request.toUserId.toString());
		});

		// Fetch users not in userNotToBeShownOnFeed and exclude the logged-in user
		const filteredUsers = await User.find({
			$and: [
				{
					_id: {
						$nin: Array.from(userNotToBeShownOnFeed).map(
							(id) => new mongoose.Types.ObjectId(id)
						),
					},
				},
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFE_DATA)
			.skip((page - 1) * limit) // Correct skip calculation for pagination
			.limit(limit);

		// Response with a message and filtered data
		res.json({
			message: `Hey ${loggedInUser.firstName}!`,
			page,
			limit,
			totalUsersShown: filteredUsers.length,
			data: filteredUsers,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

module.exports = userRouter;

module.exports = userRouter;
