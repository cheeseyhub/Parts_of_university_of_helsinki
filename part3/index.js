const express = require("express");
const dotenv = require("dotenv");
const app = express();
const morgan = require("morgan");
const { fetchPersons, PersonModel } = require("./models/persons");

dotenv.config();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
morgan.token("resContent", (request, response) => JSON.stringify(request.body));
app.use(morgan(":method :url :status :response-time ms :resContent"));
app.use(express.static("dist"));


let persons;
const updatePersonsArray = async () => {
  try {
    persons = await fetchPersons();
  } catch (error) {
    persons = {
      name: "error",
      number: "123-32323",
    };
    console.log("Could not fetch the persons.", error);
  }
};
updatePersonsArray();

app.get("/info", async (request, response) => {
  let numberOfPeople = await PersonModel.countDocuments();
  let currentDate = new Date();
  response.send(`<p>
        Phonebook has info for  ${numberOfPeople} people
        <br/>
        <br />
       ${currentDate}
        </p>`);
});

function generateId() {
  let maxId =
    persons.length > 0
      ? Math.max(...persons.map((person) => Number(person.id)))
      : 0;
  let newPersonId = Math.floor(maxId * Math.random() * 1e9).toString();

  return newPersonId;
}
/* function nameExists(name) {
  return persons.filter((person) => person.name === name).length ? true : false;
} */
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response, next) => {
  if (!request.body.number) {
    return response.status(404).json({ error: "Missing number" });
  }
  let person = new PersonModel({
    name: request.body.name,
    number: request.body.number,
    id: request.body.id || generateId(),
  });
  person.save().then((result) => {
  response.send(result)
  }).catch((error) => next(error));
  persons = persons.concat(person);
  updatePersonsArray();
});
app.get("/api/persons/:id", (request, response) => {
  PersonModel.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  PersonModel.findByIdAndDelete(request.params.id)
    .then(() => {
      updatePersonsArray();
      response.status(200).end();
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  PersonModel.findByIdAndUpdate(request.params.id, person, { new: true, runValidators:true,context:"query" })
    .then((updatedPerson) => {
      response.json(updatedPerson);
      updatePersonsArray();
    })
    .catch((error) => next(error));
});

//Error handler
const errorHandler = (error, request, response, next) => {
  if ((error.name === "CastError")) {
    return response.status(400).send({ error: "malformatted id " });
  }
  else if (error.name === "ValidationError"){
    return response.status(400).send({error: error.message})
  }
  next(error);
};
app.use(errorHandler);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
