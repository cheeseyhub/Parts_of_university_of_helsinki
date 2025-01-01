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

app.post("/api/persons", (request, response) => {
  if (!request.body.number) {
    return response.status(404).json({ error: "Missing number" });
  }
  let person = new PersonModel({
    name: request.body.name,
    number: request.body.number,
    id: request.body.id || generateId(),
  });
  persons = persons.concat(person);
  person.save();
  updatePersonsArray();
  response.status(200).send(person);
});
app.get("/api/persons/:id", (request, response) => {
  PersonModel.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  PersonModel.deleteOne({ _id: request.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        updatePersonsArray();
        response.status(200).end();
      } else {
        response.status(404).send("Person not found");
      }
    })
    .catch((error) => {
      console.log("Error deleting the person: ", error);
      response.status(500).send("Error deleting person.");
    });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
