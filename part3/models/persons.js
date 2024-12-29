const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const url = process.env.MONGODB_URI;

console.log("Connecting.........");

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to db");
  })
  .catch((error) => {
    console.log("Error connecting to the database.");
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const PersonModel = mongoose.model("Person", personSchema);
const fetchPersons = async () => {
  let persons = await PersonModel.find({});
  return persons;
};
module.exports = { fetchPersons, PersonModel };
