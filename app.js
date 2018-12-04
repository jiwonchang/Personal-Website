// https://protected-bastion-78480.herokuapp.com/ is the Heroku site

// require installation
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    nodemailer       = require("nodemailer"),
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
app.use(expressSanitizer());

// connects our express app to the mongoDB
// we've set the environment variable DATABASEURL to be the localhost mongo db if we're running the code within cloud 9
// otherwise, we've set DATABASEURL to be the MongoLab/MLab Database
var dbURL = process.env.DATABASEURL || "mongodb://localhost/p_web";
mongoose.connect(dbURL, {useNewUrlParser: true});

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
    // req.body.portfolio.body = req.sanitize(req.body.portfolio.body);
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
    // req.body.portfolio.body = req.sanitize(req.body.portfolio.body);
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
app.get("/blog/new", function(req, res) {
    res.render("blogs/new");
});
 // CREATE blog route
app.post("/blog", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var newBlog = req.body.blog;
    Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
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
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
});
 // UPDATE blog route
app.put("/blog/:id", function(req, res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body);
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
            return console.log(error);
        } else {
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            res.redirect("/");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});