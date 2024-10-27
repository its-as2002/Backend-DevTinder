const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/view", userAuth, (req, res) => {
	try {
		const user = req.user;
		const viewing_data = [
			"firstName",
			"lastName",
			"emailId",
			"photoURL",
			"about",
			"skills",
			"createdAt",
			"updatedAt",
		];
		const data = {};
		viewing_data.forEach((key) => {
			if (key in user) data[key] = user[key];
		});
		res.send(data);
	} catch (err) {
		res.status(404).send("Error : " + err.message);
	}
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const ALLOWED_UPDATES = new Set([
			"firstName",
			"lastName",
			"photoURL",
			"about",
			"skills",
		]);

		const toBeUpdated = req.body;
		const isEditAllowed = Object.keys(toBeUpdated).every((key) => {
			if (ALLOWED_UPDATES.has(key)) {
				user[key] = toBeUpdated[key];
				return true;
			} else throw new Error("Invalid update field : " + key);
		});
		if (isEditAllowed) await user.save();
		res.send("Update Successfully");
	} catch (err) {
		res.status(500).send("Error : " + err.message);
	}
});

profileRouter.patch("/password", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword)
			throw new Error("Enter both the field of Old Password and New Password");

		if (!validator.isStrongPassword(newPassword))
			throw new Error("Enter a new Strong Password like ajLd@3211");

		const isValid = await user.isPasswordValid(oldPassword);

		if (isValid) {
			const newHash = await bcrypt.hash(newPassword, 10);
			user["password"] = newHash;
			await user.save({ validateBeforeSave: true });
			res.send("Password Updated Successfully");
		} else throw new Error("Old Password is Incorrect");
	} catch (err) {
		res.status(500).send("Error : " + err.message);
	}
});
module.exports = profileRouter;
