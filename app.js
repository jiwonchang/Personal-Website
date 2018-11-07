// require installation
var methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
// require models from modules
var Blog = require("./models/blogs");
    
// general set-up
app.set("view engine", "ejs");    
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// connects our express app to the mongoDB
mongoose.connect("mongodb://localhost/p_web", {useNewUrlParser: true});

// index page routes ************************
app.get("/", function(req, res) {
    res.render("index");
});

// app.get("/about", function(req, res) {
//     res.render("about");
// });

// resume routes ****************************
app.get("/resume", function(req, res) {
    res.render("resume");
});

// portfolio routes *************************
app.get("/portfolio", function(req, res) {
    res.render("portfolio");
});

// blog routes ******************************
 // INDEX blog route
app.get("/blog", function(req, res) {
    Blog.find({}, function(err, allBlogs) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("blog", {blogs: allBlogs});
        }
    });
});
 // NEW blog route
app.get("/blog/new", function(req, res) {
    res.render("blogs/new");
});
 // CREATE blog route
app.post("/blog", function(req, res) {
    var newBlog = req.body.blog;
    Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/blog");
        }
    });
});
 // SHOW blog route
app.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blog");
            console.log(err);
        } else {
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

// contact me routes ************************
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});