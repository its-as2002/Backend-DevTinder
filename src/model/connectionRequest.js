const mongoose = require("mongoose");
const { isLowercase } = require("validator");

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			required: true,
			lowercase: true,
			enum: {
				values: ["accepted", "rejected", "ignored", "interested"],
				message: `{VALUE} is invalid`,
			},
		},
	},
	{
		timestamps: true,
	}
);

//This Schema.pre is a middleware which will run before saving the file to database 
connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
		throw new Error("You cannot send a Connection request to yourself");
	next();
});

const ConnectionRequest = mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema
);

module.exports = ConnectionRequest;
