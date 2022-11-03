const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://admin:${password}@cluster0.9jfe632.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (personName && personNumber) {
	mongoose
		.connect(url)
		.then(() => {
			const person = new Person({
				name: personName,
				number: personNumber,
			});
			return person.save();
		})
		.then(() => {
			console.log(
				`Added ${personName} number ${personNumber} to phonebook`
			);
			return mongoose.connection.close();
		})
		.catch((err) => {
			console.log(err);
		});
} else if (process.argv.length === 3) {
	mongoose.connect(url).then(() => {
		Person.find({}).then((res) => {
			console.log("phonebook:");
			res.forEach((person) => {
				console.log(`${person.name} ${person.number}`);
			});
			mongoose.connection.close();
		});
	});
}
