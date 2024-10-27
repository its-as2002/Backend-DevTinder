const validator = require("validator");

const validation = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	if (!firstName || !lastName || !emailId || !password)
		throw new Error("Please enter all the required fields");
	if (!validator.isEmail(emailId))
		throw new Error("Enter a valid emailId : " + emailId);
	if (!validator.isStrongPassword(password))
		throw new Error("Enter a Strong password");
};

module.exports = { validation };
