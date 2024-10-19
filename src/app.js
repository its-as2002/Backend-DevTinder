const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const app = express();

app.use(express.json()); // this middleware converts all the json object to the js object and passes to the request
app.post("/signUp", async (req, res) => {
	try {
		// throw new Error("Something went wrong");
		const user = new User(req.body); // instance of User Model created
		await user.save();
		res.send("User added successfully");
	} catch (err) {
		res.status(400).send(err.message);
	}
});

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

app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({}); //get all users
		res.send(users);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.delete("/user", async (req, res) => {
	const idFilter = req.body;
	try {
		await User.findByIdAndDelete(idFilter);
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
