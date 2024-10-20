const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const { validation } = require("./Utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json()); // this middleware converts all the json object to the js object and passes to the request
app.use(cookieParser()); //

//SIGN UP
app.post("/signUp", async (req, res) => {
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
app.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		if (!validator.isEmail(emailId)) throw new Error("Invalid Credentials");

		const user = await User.findOne({ emailId: emailId });

		if (user === null)
			return res.status(404).send("User not Found with associated emailId");
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			//token creation
			const token = jwt.sign({ userId: user._id }, "SECRETKEY");
			//attaching token to cookies
			res.cookie("token", token);
			res.end("User Logged in ");
		} else throw new Error("Invalid Credential");
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get("/profile", async (req, res) => {
	try {
		const cookie = req.cookies;
		const { token } = cookie;
		const { userId } = jwt.verify(token, "SECRETKEY");
		const user = await User.findById(userId);
		res.send(user);
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});
//Get user jwt.detail by email
app.get("/getUserByEmail", async (req, res) => {
	try {
		const user = await User.findOne(req.body);
		if (user === null)
			return res.status(404).send("User not Found with associated emailId");
		else res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

//Get user email by ID
app.get("/getUserById", async (req, res) => {
	try {
		const user = await User.findById(req.body);
		if (user == null)
			throw new Error(`No User found associated with userId ${req.body?._id}`);
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

//Get all users for feed
app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({}); //get all users
		res.send(users);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Delete User
app.delete("/user", async (req, res) => {
	const idFilter = req.body;
	try {
		const user = await User.findByIdAndDelete(idFilter);
		if (!user)
			throw new Error(
				`No User found associated with userId : ${req.body?._id}`
			);

		res.send("User Deleted Successfully");
	} catch (err) {
		res.status(400).send(err.message);
	}
});

//findByIdAndUpdate
app.patch("/user/:userId", async (req, res) => {
	const filter = { _id: req.params.userId };
	const updateData = req.body;

	const options = {
		returnDocument: "after",
		runValidators: true,
	};
	try {
		const ALLOWED_UPDATE = [
			"firstName",
			"lastName",
			"photoURL",
			"about",
			"skills",
			"gender",
			"age",
		];
		const isAllowed = Object.keys(updateData).every((key) =>
			ALLOWED_UPDATE.includes(key)
		);
		if (!isAllowed) throw new Error("Updates of fields not allowed");
		const user = await User.findByIdAndUpdate(filter, updateData, options);
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.use("/", (err, req, res, next) => {
	if (err) {
		res.status(err).send("Something went wrong");
	}
});

connectDB()
	.then((msg) => {
		console.log(msg);
		app.listen(7777, () => {
			console.log("Server is listening");
		});
	})
	.catch((err) => {
		console.error("Database cannnot be connected ", err.message);
	});
