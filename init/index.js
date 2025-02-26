const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/stazy");
  console.log("Database is connected");
}

main().catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67b98e1d383fbf3adb85a4dd",
  }));

  initData.data = initData.data.map((obj) => {
    let longitude = Math.random() * 360 - 180;
    let latitude = Math.random() * 180 - 90;
    return {
      ...obj,
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };
  });

  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
