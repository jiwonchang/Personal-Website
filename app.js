// require installation
var methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
// require models from modules
var Blog = require("./models/blogs");
var Portfolio = require("./models/portfolios");
    
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
 // INDEX portfolio routes
app.get("/portfolio", function(req, res) {
    Portfolio.find({}, function(err, allPortfolios) {
        if (err) {
            res.redirect("back");
        } else {
            // the .reverse() reverses the array we get from the database; this conveniently works for us since the newest
            // addition to the database will be toward the end of the array; so reversing it makes it so that the array goes
            // newest -> oldest rather than oldest -> newest.
            // but maybe instead of sorting the collection here, we can sort it every once in a while in our CREATE route
            // res.render("blog", {blogs: allBlogs});
            res.render("portfolio", {portfolios: allPortfolios.reverse()});
        }
    });
});
 // NEW portfolio route
app.get("/portfolio/new", function(req, res) {
    res.render("portfolios/new");
});
 // CREATE portfolio route
app.post("/portfolio", function(req, res) {
    var newPortfolio = req.body.portfolio;
    Portfolio.create(newPortfolio, function(err, newlyCreated) {
        if (err) {
            res.redirect("back");
        } else {
            // the .sort({date: -1}) sorts the collection in MongoDB in chronological order (newest -> oldest)
            // Blog.find().sort({date: -1});
            res.redirect("/portfolio");
        }
    });
});
 // SHOW portfolio route
app.get("/portfolio/:id", function(req, res) {
    Portfolio.findById(req.params.id, function(err, foundPortfolio) {
        if (err) {
            res.redirect("/portfolio");
            console.log(err);
        } else {
            res.render("portfolios/show", {portfolio: foundPortfolio});
        }
    });
});
 // EDIT portfolio route
app.get("/portfolio/:id/edit", function(req, res) {
    Portfolio.findById(req.params.id, function(err, foundPortfolio) {
        if (err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.render("portfolios/edit", {portfolio: foundPortfolio});
        }
    });
});
 // UPDATE portfolio route
app.put("/portfolio/:id", function(req, res) {
    var updatedPortfolio = req.body.portfolio;
    Portfolio.findByIdAndUpdate(req.params.id, updatedPortfolio, function(err, editedPortfolio) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/portfolio/" + req.params.id);
        }
    });
});
// Delete portfolio route
app.delete("/portfolio/:id", function(req, res) {
    Portfolio.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/portfolio");
        }
    });
});

// blog routes ******************************
 // INDEX blog route
app.get("/blog", function(req, res) {
    Blog.find({}, function(err, allBlogs) {
        if (err) {
            res.redirect("back");
        } else {
            // the .reverse() reverses the array we get from the database; this conveniently works for us since the newest
            // addition to the database will be toward the end of the array; so reversing it makes it so that the array goes
            // newest -> oldest rather than oldest -> newest.
            // but maybe instead of sorting the collection here, we can sort it every once in a while in our CREATE route
            // res.render("blog", {blogs: allBlogs});
            res.render("blog", {blogs: allBlogs.reverse()});
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
            // the .sort({date: -1}) sorts the collection in MongoDB in chronological order (newest -> oldest)
            // Blog.find().sort({date: -1});
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
 // EDIT blog route
app.get("/blog/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.render("blogs/" + req.params.id + "edit", {blog: foundBlog});
        }
    });
});
 // UPDATE blog route
app.put("/blog/:id", function(req, res) {
    var updatedBlog = req.body.blog;
    Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, editedBlog) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

app.delete("/blog/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/blog");
        }
    })
})

// contact me routes ************************
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});