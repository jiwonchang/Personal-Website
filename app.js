// https://protected-bastion-78480.herokuapp.com/ is the Heroku site

// require installation
var passportLocalMongoose = require("passport-local-mongoose"),
    expressSanitizer      = require("express-sanitizer"),
    expressSession        = require("express-session"),
    methodOverride        = require("method-override"),
    LocalStrategy         = require("passport-local"),
    flash                 = require("connect-flash"),
    bodyParser            = require("body-parser"),
    nodemailer            = require("nodemailer"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    express               = require("express"),
    app                   = express();
    
// require environment vars
require("dotenv").config();

// require models from modules
var Blog = require("./models/blogs");
var Portfolio = require("./models/portfolios");
var User = require("./models/user"); 

// Requiring Routes
var portfolioRoutes = require("./routes/portfolios"),
    contactRoutes   = require("./routes/contact"),
    resumeRoutes    = require("./routes/resume"),
    authRoutes      = require("./routes/index"),
    blogRoutes      = require("./routes/blogs");
    
// connects our express app to the mongoDB
// we've set the environment variable DATABASEURL to be the localhost mongo db if we're running the code within cloud 9
// otherwise, we've set DATABASEURL to be the MongoLab/MLab Database
var dbURL = process.env.DATABASEURL || "mongodb://localhost:27017/p_web";
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

// general set-up
app.set("view engine", "ejs");    
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
// console.log(process.env.EXPRESS_SESSION_SECRET);
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// our custom middleware for passing in the currentUser = "req.user" ("undefined" if logged out, else will contain user info) 
// object into every template/route so that the navbar can access the currentUser object on every page.
app.use(function(req, res, next) {
    // whatever we put in "res.locals" becomes available in every template/route/page
    res.locals.currentUser = req.user;
    // we also make the flash error message "error" variable accessible in every page that is being rendered
    res.locals.error = req.flash("error");
    // we also make the flash success message "success" variable accessible in every page that is being rendered
    res.locals.success = req.flash("success");
    // The "next()" function is CRUCIAL; if we don't have it, the code will stop after the execution of the middleware 
    next();
});

// We require the route files, and require that the routes contain the prefix that will be added in front of every single
// route in that file
app.use("/portfolio", portfolioRoutes);
app.use("/blog", blogRoutes);
app.use(contactRoutes);
app.use(resumeRoutes);
app.use(authRoutes);

// heroku will provide its own process.env.PORT (usually port 80)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});