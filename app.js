// Require all the necessary modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const User = require("./models/user");

// Connect to the database
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/stazy");
  console.log("Database is connected");
}

main().catch((err) => console.log(err));

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Express session
app.use(
  expressSession({
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
app.use("/stazy", listingRoutes);
app.use("/stazy/:id/review", reviewRoutes);
app.use("/", userRoutes);

// Catch-all route for handling 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 404, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

// Start the server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
