const { User } = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
	try {
		const cookie = req.cookies;
		const { loginToken } = cookie;
		if (!loginToken)
			throw new Error("Login Token not found : Please Login Again!!");
		const decodedMessage = jwt.verify(loginToken, "SECRbETKEY");
		const { userId } = decodedMessage;
		const user = await User.findById(userId);
		if (!user) throw new Error("Invalid user");
		req.user = user;
		next();
	} catch (err) {
		res.status(404).send("Error : " + err.message);
	}
};

module.exports = { userAuth };
