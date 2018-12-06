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

// connects our express app to the mongoDB
// we've set the environment variable DATABASEURL to be the localhost mongo db if we're running the code within cloud 9
// otherwise, we've set DATABASEURL to be the MongoLab/MLab Database
var dbURL = process.env.DATABASEURL || "mongodb://localhost/p_web";
mongoose.connect(dbURL, {useNewUrlParser: true});

// index page routes ************************
app.get("/", function(req, res) {
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
            req.flash("error", "Something went wrong while retrieving all portfolio entries!");
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
app.get("/portfolio/new", isLoggedIn, function(req, res) {
    res.render("portfolios/new");
});
 // CREATE portfolio route
app.post("/portfolio", isLoggedIn, function(req, res) {
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
            res.redirect("/portfolio");
        }
    });
});
 // SHOW portfolio route
app.get("/portfolio/:id", function(req, res) {
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
app.get("/portfolio/:id/edit", checkPortfolioOwnership, function(req, res) {
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
app.put("/portfolio/:id", checkPortfolioOwnership, function(req, res) {
    // req.body.portfolio.body = req.sanitize(req.body.portfolio.body);
    var updatedPortfolio = req.body.portfolio;
    Portfolio.findByIdAndUpdate(req.params.id, updatedPortfolio, function(err, editedPortfolio) {
        if (err) {
            req.flash("error", "Something went wrong while updating that portfolio entry!");
            res.redirect("back");
        } else {
            res.redirect("/portfolio/" + req.params.id);
        }
    });
});
// Delete portfolio route
app.delete("/portfolio/:id", checkPortfolioOwnership, function(req, res) {
    Portfolio.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong while deleting that portfolio entry!");
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
            req.flash("error", "Something went wrong while retrieving all blog posts!");
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
app.get("/blog/new", isLoggedIn, function(req, res) {
    res.render("blogs/new");
});
 // CREATE blog route
app.post("/blog", isLoggedIn, function(req, res) {
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
app.get("/blog/:id", function(req, res) {
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
app.get("/blog/:id/edit", checkBlogOwnership, function(req, res) {
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
app.put("/blog/:id", checkBlogOwnership, function(req, res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    var updatedBlog = req.body.blog;
    Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, editedBlog) {
        if (err) {
            req.flash("error", "Something went wrong while updating that blog post!");
            res.redirect("back");
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

app.delete("/blog/:id", checkBlogOwnership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong while deleting that blog post!");
            res.redirect("back");
        } else {
            res.redirect("/blog");
        }
    });
});

// contact me routes ************************
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.post("/contact", function(req, res) {
    const output = `
        <p>You have a new contact request:</p>
        <h3>Contact Details:</h3>
        <ul>
            <li>Name: ${req.body.contact.name}</li>
            <li>email: ${req.body.contact.email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.contact.message}</p>
    `;
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER, // environment variable
            pass: process.env.GMAIL_PASS // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `'"${req.body.contact.name}" <${req.body.contact.email}>'`, // sender address
        to: process.env.GMAIL_RECEIVER, // list of receivers
        subject: req.body.contact.subject, // Subject line
        // text: `${req.body.contact.name} (${req.body.contact.email}) says: ${req.body.contact.message}` // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error", "The message could not be sent");
            return console.log(error);
        } else {
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            req.flash("success", "Your message has been successfully sent!");
            res.redirect("/contact");
        }
    });
});


// // Authentication Routes
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

 // login routes
app.get("/login", function(req, res) {
    // "returnTo" saves the URL/page the user was at before being asked to log in. After successful log in, redirects to that page.
    // req.session.returnTo = req.originalUrl;
    res.render("login");
});
 
  // login logic route
app.post("/login", passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
    // console.log("this is the second print:" + req.session.returnTo);
    delete req.session.returnTo;
});

 // logout routes
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


// Middleware

// Our middleware to see if a user is logged in and grant/restrict access accordingly
function isLoggedIn(req, res, next) {
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
}

// Checks if the current user (if logged in) is the owner of a blog post
function checkBlogOwnership(req, res, next) {
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
}

// Checks if the current user (if logged in) is the owner of a post/entry
function checkPortfolioOwnership(req, res, next) {
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
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});