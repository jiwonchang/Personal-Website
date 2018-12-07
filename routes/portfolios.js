var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolios");
var middleware = require("../middleware");

//===================================================
// Portfolio Routes
//===================================================

 // INDEX portfolio routes
router.get("/", function(req, res) {
    // the [],{ sort: { _id: -1 } }, parameters sorts the retrieved data in *descending* order (default is ascending order).
    Portfolio.find({}, [], { sort: { _id: -1 } }, function(err, allPortfolios) {
        if (err) {
            req.flash("error", "Something went wrong while retrieving all portfolio entries!");
            res.redirect("back");
        } else {
            // the .reverse() reverses the array we get from the database; this conveniently works for us since the newest
            // addition to the database will be toward the end of the array; so reversing it makes it so that the array goes
            // newest -> oldest rather than oldest -> newest.
            // but maybe instead of sorting the collection here, we can sort it every once in a while in our CREATE route
            res.render("portfolio", {portfolios: allPortfolios});
            // res.render("portfolio", {portfolios: allPortfolios.reverse()});
        }
    });
});
 // NEW portfolio route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("portfolios/new");
});
 // CREATE portfolio route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // req.body.portfolio.body = req.sanitize(req.body.portfolio.body);
    var newPortfolio = req.body.portfolio;
    newPortfolio.author = {
        id: req.user._id,
        username: req.user.username
    };
    Portfolio.create(newPortfolio, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong while creating the portfolio entry!");
            res.redirect("back");
        } else {
            // the .sort({date: -1}) sorts the collection in MongoDB in chronological order (newest -> oldest)
            // Blog.find().sort({date: -1});
            req.flash("success", "Portfolio entry successfully created!");
            res.redirect("/portfolio");
        }
    });
});
 // SHOW portfolio route
router.get("/:id", function(req, res) {
    Portfolio.findById(req.params.id, function(err, foundPortfolio) {
        if (err) {
            req.flash("error", "That portfolio entry does not exist!");
            res.redirect("/portfolio");
            console.log(err);
        } else {
            if (foundPortfolio === null) {
                req.flash("error", "That portfolio entry does not exist!");
                return res.redirect("/portfolio");
            }
            res.render("portfolios/show", {portfolio: foundPortfolio});
        }
    });
});
 // EDIT portfolio route
router.get("/:id/edit", middleware.checkPortfolioOwnership, function(req, res) {
    Portfolio.findById(req.params.id, function(err, foundPortfolio) {
        if (err) {
            req.flash("error", "That porfolio entry could not be found");
            res.redirect("back");
            console.log(err);
        } else {
            if (foundPortfolio === null) {
                req.flash("error", "That portfolio entry does not exist!");
                return res.redirect("/portfolio");
            }
            res.render("portfolios/edit", {portfolio: foundPortfolio});
        }
    });
});
 // UPDATE portfolio route
router.put("/:id", middleware.checkPortfolioOwnership, function(req, res) {
    // req.body.portfolio.body = req.sanitize(req.body.portfolio.body);
    var updatedPortfolio = req.body.portfolio;
    Portfolio.findByIdAndUpdate(req.params.id, updatedPortfolio, function(err, editedPortfolio) {
        if (err) {
            req.flash("error", "Something went wrong while updating that portfolio entry!");
            res.redirect("back");
        } else {
            req.flash("success", "Portfolio entry successfully updated!");
            res.redirect("/portfolio/" + req.params.id);
        }
    });
});
// Delete portfolio route
router.delete("/:id", middleware.checkPortfolioOwnership, function(req, res) {
    Portfolio.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong while deleting that portfolio entry!");
            res.redirect("back");
        } else {
            req.flash("success", "Portfolio entry successfully deleted!");
            res.redirect("/portfolio");
        }
    });
});

module.exports = router;