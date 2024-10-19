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
//findOneAndUpdate
app.patch("/user", async (req, res) => {
	const filter = req.body.searchFilter;
	const updateData = req.body.updateData;
	const options = {
		returnDocument: "after",
	};
	try {
		const user = await User.findOneAndUpdate(filter, updateData, options);
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

//findByIdAndUpdate
app.patch("/userById", async (req, res) => {
	const filter = { _id: req.body.userId };
	const updateData = req.body;
	const options = {
		returnDocument: "after",
	};
	try {
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
