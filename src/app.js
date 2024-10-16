const express = require("express");
const { admin } = require("./middlewares/auth");
const app = express();
exports.app = app;

// Error handling

// The error thrown by the /admin/login will be catched by the '/' route and handled
app.get("/admin/login", (req, res) => {
	throw new Error("Throwing random error");
	res.send(
		"Server is veried the login details and redirected to the after login dashboard" //this handler is just for learning concept doesn't really useful as login call are post call. and this route wasn't authenticated.
	);
});

// The error thrown by the /admin/getAllData will be catched inside the '/admin/getAllData' catch block and handled there only
app.get("/admin/getAllData", admin, (req, res) => {
	try {
		throw new Error("Throws error which is catched inside a catch block");
		res.send("Server is sending all data from /admin/getAllData");
	} catch (err) {
		console.error(err.message);
		res.send(err.message);
	}
});

app.use("/", (err, req, res, next) => {
	if (err) {
		console.error(err.message);
		res.status(500).send(err.message);
	}
});

app.listen(7777, () => {
	console.log("Server is listening");
});
