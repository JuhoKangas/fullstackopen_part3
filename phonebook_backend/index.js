require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "Malformatted id" });
	}

	next(error);
};

app.use(errorHandler);

app.get("/api/persons", (req, res) => {
	Person.find({}).then((people) => {
		res.json(people);
	});
});

app.get("/api/info", (req, res) => {
	Person.find({}).then((people) => {
		const peopleAmount = people.length;
		const timeStamp = new Date();
		res.send(
			`<p>Phonebook has info for ${peopleAmount} people</p><br />${timeStamp}`
		);
	});
});

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((err) => next(err));
});

const generateId = () => {
	const id = Math.floor(Math.random() * 100000000);
	return id;
};

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "name or number missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		res.json(savedPerson);
	});
});

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	Person.findByIdAndRemove(id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
