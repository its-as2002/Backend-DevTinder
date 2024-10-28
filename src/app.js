const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json()); // this middleware converts all the json object to the js object and passes to the request
app.use(cookieParser()); //

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requesRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requesRouter);
app.use("/user",userRouter)

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
