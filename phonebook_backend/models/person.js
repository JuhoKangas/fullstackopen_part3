const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then((res) => {
		console.log("connected to MongoDB");
	})
	.catch((err) => {
		console.log("Error connecting to MongoDB:", err.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

personSchema.set("toJSON", {
	transform: (document, returnedbject) => {
		returnedbject.id = returnedbject._id.toString();
		delete returnedbject._id;
		delete returnedbject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
