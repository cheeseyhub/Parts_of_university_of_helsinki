const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const User = require("../models/user");
beforeEach(() => {
  console.log("working");
});
describe("Correct Users are added.", () => {
  test("username or password less than 3 characters is not accepted", async () => {
    let newUser = {
      username: "de",
      password: "23",
      name: "3",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
  test("User without username is not accepted.", async () => {
    let newUser = {
      password: "something",
      name: "some",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
  test("User without password is not accepted.", async () => {
    let newUser = {
      username: "hmm",
      name: "some",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
});

after(async () => {
  mongoose.connection.close();
});
