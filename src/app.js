const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const { validation } = require("./Utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
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
			const token = jwt.sign({ userId: user._id }, "SECRbETKEY", {
				expiresIn: "1h", //jsw expires in 1 hour
			});
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

app.get("/profile", userAuth, (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("Error : " + err.message);
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
