const express = require("express");
const { validation } = require("../Utils/validation");
const { User } = require("../model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const authRouter = express.Router();

//SIGN UP
authRouter.post("/signUp", async (req, res) => {
	try {
		//Perform data validations of req.body
		validation(req);
		//Encryption of password before storing in database
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		const userData = {
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		};

		const user = new User(userData); // instance of User Model created
		await user.save();
		res.send("User added successfully");
	} catch (err) {
		res.status(400).send("ERROR : " + err.message);
	}
});

//Sign In
authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		if (!validator.isEmail(emailId)) throw new Error("Invalid Credentials");

		const user = await User.findOne({ emailId: emailId });

		if (user === null)
			return res.status(404).send("User not Found with associated emailId");
		const isPasswordValid = user.isPasswordValid(password);

		if (isPasswordValid) {
			//token creation
			const token = user.getJWT();
			//attaching token to cookies
			res.cookie("loginToken", token, {
				expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // cookie expires in 1 hour
			});
			res.end("User Logged in ");
		} else throw new Error("Invalid Credential");
	} catch (err) {
		res.status(400).send(err.message);
	}
});

authRouter.post("/logout", (req, res) => {
	res.cookie("loginToken", null, {
		expires: new Date(Date.now()),
	});
	res.send("User Logged Out");
});
module.exports = authRouter;
