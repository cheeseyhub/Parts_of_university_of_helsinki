import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("At least enter the password as the argument");
  process.exit();
}

const password = process.argv[2];
const personName = process.argv[3];
const personPhoneNumber = process.argv[4];

const url = `mongodb+srv://admin:${password}@cluster0.pmzt8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(`${person.name}  ${person.number}`);
      });
      mongoose.connection.close();
      process.exit();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: personName,
    number: `${personPhoneNumber}`,
  });

  person.save().then((result) => {
    console.log(`Added ${personName} ${personPhoneNumber} to the phonebook.`);
    mongoose.connection.close();
  });
}
