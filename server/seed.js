// simple script to load some sample data for testing
// run with: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Pet = require("./models/Pet");

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "demo@petcare.com" });
  if (existing) {
    console.log("Demo user already exists, skipping seed.");
    process.exit();
  }

  const user = await User.create({
    name: "Demo User",
    email: "demo@petcare.com",
    password: "demo1234",
  });

  await Pet.create([
    {
      userId: user._id,
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      gender: "Male",
      notes: "Loves swimming, allergic to chicken.",
    },
    {
      userId: user._id,
      name: "Whiskers",
      breed: "Persian Cat",
      age: 2,
      gender: "Female",
      notes: "Needs daily brushing.",
    },
  ]);

  console.log("Seed complete. Login with demo@petcare.com / demo1234");
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
