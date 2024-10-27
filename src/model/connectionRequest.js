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
            lowercase : true,
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

const ConnectionRequest = mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema
);

module.exports = ConnectionRequest;
