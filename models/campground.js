const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampGroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      // 캠핑장에 달린 리뷰를 확인하기 위함.
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// middleware를 이용해 캠핑장소사라지면 리뷰도 사라지게만들기.
CampGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampGroundSchema);
