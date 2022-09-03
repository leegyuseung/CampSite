const mongoose = require("mongoose");
const CampGround = require("../models/campground");
const cities = require("./cities");
const { places, description, descriptors } = require("./seedHelpers");

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
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // DB에 정보를 모두 제거하기
  await CampGround.deleteMany({});
  // 50개의 랜덤 캠핑장을 만들기
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new CampGround({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    camp.save();
  }
};

seedDB();
// .then(() => {
//   mongoose.connection.close();
// })
// .catch((e) => {
//   console.log(e);
// });
