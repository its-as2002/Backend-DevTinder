const express = require("express");
const app = express();

// Handle mutliple route in a single app.use and if want we can pass all the handlers inside a array like app.use("/route",[rh1,rh2,rh3]) or like app.use("/route",[rh1,rh2],rh3) both are right and give same result are normal way.
app.use(
	"/user",
	(req, res, next) => {
		const token = "abc";
		if (token != "abc") res.status(404).send("Unauthorized request");
		else next();
	},
	(req, res) => {
		res.send("Server is saying hi from /user ");
	}
);

// handle multiple route separately with extended route with same prefix
app.use("/hello", (req, res, next) => {
	console.log("Authenticated");
	next();
});

app.get("/hello/abc", (req, res) => {
	res.send("Saying hi from /hello/abc"); //authenticated from /hello
});

app.get("/hello/dbcd", (req, res) => {
	res.send("Saying hllo from /hello/dbcd"); //authentiated from /hello
});

//
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
