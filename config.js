const mongoose = require("mongoose");

const secretKey = "12345-67890-09876-54321";
const mongoUrl =
	"mongodb+srv://dhangareumesh:Umesh@1234@cluster0.m1eihh8.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
	try {
		const con = await mongoose.connect(mongoUrl);
		console.log("DB connected successfully!");
	} catch (err) {
		console.log(`Error: ${err}`);
		process.exit(1);
	}
};

module.exports = {
	secretKey,
	connectDB,
};
