const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;
const validator = require("validator");
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
			validate(value) {
				if (!validator.isEmail(value))
					throw new Error("Enter a valid email" + value);
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value))
					throw new Error("Password is not strong " + value);
			},
		},
		age: {
			type: Number,
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
			validate(value) {
				if (!validator.isURL(value))
					throw new Error("Invalid Photo URL : " + value);
			},
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

userSchema.methods.getJWT = function () {
	const user = this;
	const token = jwt.sign({ userId: user._id }, "SECRbETKEY", {
		expiresIn: "7d",
	});
	return token;
};

userSchema.methods.isPasswordValid = async function (password) {
	const user = this;
	const valid = await bcrypt.compare(password, user.password);
	return valid;
};

const User = model("User", userSchema); // not be done using new keyword
module.exports = { User };
                                                                                                                                                                                                                                                                