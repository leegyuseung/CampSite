const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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

// parsing
app.use(express.urlencoded({ extended: true }));
// method = put, delete 사용
app.use(methodOverride("_method"));

// home router
app.get("/", (req, res) => {
  res.render("home");
});

// campgounds/index router
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
});

// new router
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new CampGround(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// campgrounds/show router
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// Update router
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// Delete router
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// express 연결
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
