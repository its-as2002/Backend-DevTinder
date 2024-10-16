const express = require("express");
const { user, admin } = require("./middlewares/auth");
const app = express();
exports.app = app;

//writing code middleware use for authentication as per industry standards for /user and /admin
app.use("/user", user);
// app.use("/admin", admin); commented this because there were two route which was admin/login and 2nd one was admin/getAllData so admin login don't need to be authenticated by /admin as it is a login page and there was only one route which need authentication which was /admin/getAllData so i have passed the middleware before the route handler in the callback chain of /admin/getAllData

// USER routes
app.get("/user", (req, res) => {
	res.send("Server is sending response from /user after being authenticated");
});
app.get("/user/details", (req, res) => {
	res.send("Server is sending user details");
});

app.get("/user/random", (req, res) => {
	res.send(
		"Server is respondin to request of /user/random by authenticating user"
	);
});

//ADMIN  routes
app.get("/admin/login", (req, res) => {
	res.send(
		"Server is veried the login details and redirected to the after login dashboard" //this handler is just for learning concept doesn't really useful as login call are post call. and this route wasn't authenticated.
	);
});

app.get("/admin/getAllData", admin, (req, res) => {
	res.send("Server is sending all data from /admin/getAllData");
});

app.listen(7777, () => {
	console.log("Server is listening");
});
