const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
	firstName: {
		type: String,
	},
	lastName: String, // shorthand for type : String
	emailId: String,
	password: String,
	age: Number,
	gender: String,
});

const User = model("User", userSchema); // not be done using new keyword
module.exports = { User };
