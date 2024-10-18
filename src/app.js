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
