const express = require("express");
const app = express();

app.use("/", (req, res) => {
	// When we brought the '/' route at bottom of all the routes, the all routes returns response as expected.
	res.send("Hello From /");
});

app.use("/user", (req, res) => {
	res.send("Server is saying hi from /user");
});

app.use("/profile", (req, res) => {
	res.send("Server is responding from /profile");
});

app.listen(7777, () => {
	console.log("Server is listening");
});

// Here we can see that http://localhost:7777/user when called from postman gives response Hello from / . This is due to /

// In your Express code, the issue arises because both app.use("/", ...) and app.use("/user", ...) are defined using app.use(), which matches all HTTP methods (GET, POST, etc.) and handles any route that starts with the given path.

// Here’s why http://localhost:7777/user returns Hello From / instead of the expected /user response:

// app.use() Behavior:
// app.use() does not match exact routes; instead, it matches all paths that begin with the specified route.
// When app.use("/", ...) is defined, it matches every request because every path starts with / (including /user).
// Thus, when you make a request to /user, Express first matches the "/" route. Since app.use() doesn’t stop the processing of subsequent middleware after it handles a request, the res.send() in the "/" route sends a response and the request never reaches the "/user" route handler
