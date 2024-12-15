const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
morgan.token("resContent", (request, response) => JSON.stringify(request.body));
app.use(morgan(":method :url :status :response-time ms :resContent"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  let numberOfPeople = persons.length;
  let currentDate = new Date();

  response.send(`<p>
        Phonebook has info for ${numberOfPeople} people
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
function nameExists(name) {
  return persons.filter((person) => person.name === name).length ? true : false;
}
app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.post("/api/persons", (request, response) => {
  if (nameExists(request.body.name)) {
    return response.status(404).json({ error: "The name must be unique" });
  }
  if (!request.body.name) {
    return response.status(404).json({ error: "Missing Name" });
  }
  if (!request.body.number) {
    return response.status(404).json({ error: "Missing number" });
  }
  let person = {
    name: request.body.name,
    id: generateId(),
  };
  persons = persons.concat(person);
  response.status(200).end();
  console.log(request.body);
});
app.get("/api/persons/:id", (request, response) => {
  let id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) return response.status(404).end();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const port = process.env.port || 3001;

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
