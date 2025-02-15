const mongoose = require("mongoose");
const intiData = require("./data");
const Listing = require("../models/listing");

main()
  .then((res) => {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/stazy");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(intiData.data);
  console.log("Data was initialized");
};

initDB();
