const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campground");
const reviews = require("./routes/reviews");

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

// public 가능하게 하기
app.use(express.static(path.join(__dirname, "public")));

// session
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // req.locals.error = req.flash("error");
  next();
});

// router
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// home router
app.get("/", (req, res) => {
  res.render("home");
});

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
