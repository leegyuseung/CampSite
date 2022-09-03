const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const CampGround = require("./models/campground");

// mongoose & mongoDB
async function main() {
  await mongoose.connect("mongodb://localhost:27017/campsite");
}

main()
  .catch((e) => {
    console.error.bind(console, "connection error:");
  })
  .then(() => {
    console.log("Database Connection!");
  });

const app = express();

// express & ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// home router
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new CampGround({
    title: "My Backyard",
    description: "cheap camping",
  });
  await camp.save();
  res.send(camp);
});

// express 연결
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
