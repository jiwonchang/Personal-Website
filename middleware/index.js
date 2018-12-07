// All the middleware goes here

var Blog = require("../models/blogs");
var Portfolio = require("../models/portfolios");

var middlewareObj = {};

// Middleware

// Our middleware to see if a user is logged in and grant/restrict access accordingly
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // "req.flash()" displays a message on one page; if the user leaves the page or refreshes the page, the message disappears.
    // "req.flash()" requires two arguments: a key and a message
    // "req.flash()" does not display the message on the current page; it always displays the message ON THE NEXT PAGE.
    // therefore, req.flash() must always be used BEFORE a redirect.
    req.flash("error", "You need to be logged in to do that");
    
    // "returnTo" saves the URL/page the user was at before being asked to log in. After successful log in, redirects to that page.
    req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo);
    
    res.redirect("/login");
};

// Checks if the current user (if logged in) is the owner of a blog post
middlewareObj.checkBlogOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function(err, foundBlog) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    // redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        // "returnTo" saves the URL/page the user was at before being asked to log in. After successful log in, redirects to that page.
        req.session.returnTo = req.originalUrl;
        // console.log(req.session.returnTo);
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

// Checks if the current user (if logged in) is the owner of a post/entry
middlewareObj.checkPortfolioOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Portfolio.findById(req.params.id, function(err, foundPortfolio) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundPortfolio.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    // redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        // "returnTo" saves the URL/page the user was at before being asked to log in. After successful log in, redirects to that page.
        req.session.returnTo = req.originalUrl;
        // console.log(req.session.returnTo);
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;