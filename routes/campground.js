const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const CampGround = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

// JOI 유효성 검사 미들웨어

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// campgrounds/index router
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// new router
router.get(
  "/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash("success", "sueccesfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// campgrounds/show router
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    // if (!campground) {
    //   req.flash("error", "Cannot find that campground");
    //   return res.redirect("/campgrounds");
    // }
    res.render("campgrounds/show", { campground });
  })
);

// Update router
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    // if (!campground) {
    //   req.flash("error", "Cannot find that campground");
    //   return res.redirect("/campgrounds");
    // }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "sueccesfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete router
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
