const personRouter = require("express").Router();
const person = require("../models/person");
const { fetchPersons, PersonModel } = require("../models/person");

let persons = [];
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
personRouter.get("/info", async (request, response) => {
  let numberOfPeople = await PersonModel.countDocuments();
  let currentDate = new Date();
  response.send(`<p>
        Phonebook has info for  ${numberOfPeople} people
        <br/>
        <br />
       ${currentDate}
        </p>`);
});

personRouter.get("/", (request, response) => {
  response.json(persons);
});

personRouter.post("/array", (request, response, next) => {
  if (!request.body.number) {
    return response.status(404).json({ error: "Missing number" });
  }
  let person = new PersonModel({
    name: request.body.name,
    number: request.body.number,
    id: request.body.id || generateId(),
  });
  person
    .save()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => next(error));
  persons = persons.concat(person);
  updatePersonsArray();
});
personRouter.get("/:id", (request, response, next) => {
  PersonModel.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

personRouter.delete("/:id", (request, response, next) => {
  PersonModel.findByIdAndDelete(request.params.id)
    .then(() => {
      updatePersonsArray();
      response.status(200).end();
    })
    .catch((error) => next(error));
});
personRouter.put("/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  PersonModel.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
      updatePersonsArray();
    })
    .catch((error) => next(error));
});
module.exports = personRouter;
