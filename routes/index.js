var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

var Blog = require("../models/blogs")

//===================================================
// Root/Index Routes
//===================================================

router.get("/", function(req, res) {
    // var blogs = {calBlog: null, ucsbBlog: null};
    // Blog.find({title: "The Climb in UC Berkeley"}, function(err, CalBlog) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         blogs.calBlog = CalBlog;
    //     }
    // });
    // Blog.find({title: "Golden Years in UCSB"}, function(err, UCSBBlog) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         blogs.ucsbBlog = UCSBBlog;
    //     }
    // });
    
    // console.log(blogs.calBlog);
    // res.render("index", {calBlog: blogs.calBlog, ucsbBlog: blogs.ucsbBlog});
    
    var titleArray = [{title: "Golden Years in UCSB"}, {title: "The Climb in UC Berkeley"}];
    
    // finds the blog posts that have a title found in the titleArray. Then, if all posts were found, assigns the posts to
    // variables. If any posts are missing, then simply keeps the variables as null, which the index page then deals with
    // accordingly.
    Blog.find({"$or": titleArray}, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var ucsbBlog = null;
                var calBlog = null;
                if (results.length === titleArray.length) {
                    ucsbBlog = results[0];
                    calBlog = results[1];
                }
                // console.log(ucsbBlog);
                // console.log(calBlog);
                res.render("index", {calBlog: calBlog, ucsbBlog: ucsbBlog});
            }
        }
    );
    
    // res.render("index", {calBlog: null, ucsbBlog: null});
});

//===================================================
// Authentication Routes
//===================================================

 // login routes
router.get("/login", function(req, res) {
    // "returnTo" saves the URL/page the user was at before being asked to log in. After successful log in, redirects to that page.
    // req.session.returnTo = req.originalUrl;
    res.render("login");
});
 
  // login logic route
router.post("/login", passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
    // console.log("this is the second print:" + req.session.returnTo);
    delete req.session.returnTo;
});

 // logout routes
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

//  // register route
// app.get("/register", function(req, res) {
//     res.render("register");
// });

//  // register logic route (handling user sign up)
// app.post("/register", function(req, res) {
//     User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
//         if (err) {
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function() {
//             res.redirect("/");
//         });
//     });
// });