const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const CampGround = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js");

// JOI 유효성 검사 미들웨어

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// review 생성
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// review 삭제
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "sueccesfully deleted reviews!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
