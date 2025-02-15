const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const options = {
  usernameField: "email",
};
userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);
