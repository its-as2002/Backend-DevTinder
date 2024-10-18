const mongoose = require("mongoose");
const { connect } = mongoose;

const connectDB = async () => {
	await connect(
		"mongodb+srv://itsas2003:Ayush2002@dev-tindercluster.zdxdw.mongodb.net/"
	);
	return "Database connection established";
};

module.exports = { connectDB };
