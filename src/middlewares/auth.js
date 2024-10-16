const user = (req, res, next) => {
	const token = "abc";
	if (token != "abc") {
		res.status(404).send("Unauthorized request");
		console.log("Authentication failed for /user");
	} else {
		console.log("Authenticated ");
		next();
	}
};

const admin = (req, res, next) => {
	const token = "admin";
	if (token != "admin") {
		res.status(404).send("Unauthorized request");
		console.log("Authentication failed for /admin");
	} else {
		console.log("Authenticated");
		next();
	}
};

module.exports = { user, admin };
