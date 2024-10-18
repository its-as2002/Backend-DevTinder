const mongoose = require("mongoose");
const { connect } = mongoose;

(async () => {
	await connect(
		"mongodb+srv://itsas2003:Ayush2002@dev-tindercluster.zdxdw.mongodb.net/"
	);
	return "Database connection established";
})()
	.then(console.log)
	.catch((err) => {
		console.error(err.message);
	});
