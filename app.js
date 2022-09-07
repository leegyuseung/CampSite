const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const CampGround = require("./models/campground");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
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
app.engine("ejs", ejsMate);

// parsing
app.use(express.urlencoded({ extended: true }));
// method = put, delete 사용
app.use(methodOverride("_method"));

// home router
app.get("/", (req, res) => {
  res.render("home");
});

// campgounds/index router
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// new router
app.get(
  "/campgrounds/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new ExpressError("Invalid Campground Data", 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// campgrounds/show router
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// Update router
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete router
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh no, something went wrong";
  res.status(statusCode).render("error", { err });
});

// express 연결
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
