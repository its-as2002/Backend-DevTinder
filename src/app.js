const express = require("express");
const app = express();

app.use("/user", (req, res) => {
	res.send("Server is saying hi from /user");
});

app.use("/profile", (req, res) => {
	res.send("Server is responding from /profile");
});

app.use("/", (req, res) => {
	// When we brought the '/' route at bottom of all the routes, the all routes returns response as expected.
	res.send("Hello From /");
});

app.listen(7777, () => {
	console.log("Server is listening");
});
