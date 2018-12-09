var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middleware = require("../middleware")

//===================================================
// Blog Routes
//===================================================

 // INDEX blog route
router.get("/", function(req, res) {
    // the [],{ sort: { _id: -1 } }, parameters sorts the retrieved data in *descending* order (default is ascending order).
    Blog.find({}, [], { sort: { _id: -1 } }, function(err, allBlogs) {
        if (err) {
            req.flash("error", "Something went wrong while retrieving all blog posts!");
            res.redirect("back");
        } else {
            // the .reverse() reverses the array we get from the database; this conveniently works for us since the newest
            // addition to the database will be toward the end of the array; so reversing it makes it so that the array goes
            // newest -> oldest rather than oldest -> newest.
            // but maybe instead of sorting the collection here, we can sort it every once in a while in our CREATE route
            res.render("blog", {blogs: allBlogs});
            // res.render("blog", {blogs: allBlogs.reverse()});
        }
    });
});

// var blogCategories = {
//     "Thoughts": [],
//     "Opinion": [], 
//     "Life": [], 
//     "Lessons": [], 
//     "Advice": [], 
//     "Food": [], 
//     "Tech": [], 
//     "Art": [], 
//     "Sports": [], 
//     "Random": []
// }

 // NEW blog route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("blogs/new");
});
 // CREATE blog route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    var newBlog = req.body.blog;
    newBlog.author = {
        id: req.user._id,
        username: req.user.username
    };
    Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong while creating that blog post!");
            res.redirect("back");
        } else {
            // add the blog to the array of its respective category, to retrieve later in the "related posts" section
            // var categ = newBlog.category;
            // blogCategories[categ].push(newBlog);
            // console.log(blogCategories);
            res.redirect("/blog");
        }
    });
});
 // SHOW blog route
router.get("/:id", function(req, res) {
    // console.log(req.params.id);
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            req.flash("error", "That blog post does not exist!");
            res.redirect("/blog");
            console.log(err);
        } else {
            if (foundBlog === null) {
                req.flash("error", "That blog post does not exist!");
                return res.redirect("/blog");
            }
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});
 // EDIT blog route
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            req.flash("error", "That blog post does not exist!");
            res.redirect("back");
            console.log(err);
        } else {
            if (foundBlog === null) {
                req.flash("error", "That blog post does not exist!");
                return res.redirect("/blog");
            }
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
});
 // UPDATE blog route
router.put("/:id", middleware.checkBlogOwnership, function(req, res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    var updatedBlog = req.body.blog;
    Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, editedBlog) {
        if (err) {
            req.flash("error", "Something went wrong while updating that blog post!");
            res.redirect("back");
        } else {
            req.flash("success", "Blog post successfully updated!");
            res.redirect("/blog/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkBlogOwnership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong while deleting that blog post!");
            res.redirect("back");
        } else {
            req.flash("success", "Blog post successfully deleted!");
            res.redirect("/blog");
        }
    });
});

module.exports = router;