const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 42,
		},
		lastName: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 42,
		},
		emailId: {
			type: String,
			unique: true,
			lowercase: true,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
			min: 18,
		},
		gender: {
			type: String,
			lowercase: true,
			validate(value) {
				if (!["male", "female", "other"].includes(value))
					throw new Error("Gender is not valid");
			},
		},
		photoURL: {
			type: String,
			default: "https://i.sstatic.net/34AD2.jpg",
		},
		about: {
			type: String,
			default: "I am a developer!!",
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

const User = model("User", userSchema); // not be done using new keyword
module.exports = { User };
