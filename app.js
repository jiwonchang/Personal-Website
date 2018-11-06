var express = require("express"),
    app     = express();
    
app.set("view engine", "ejs");    
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/resume", function(req, res) {
    res.render("resume");
});

app.get("/portfolio", function(req, res) {
    res.render("portfolio");
});

app.get("/blog", function(req, res) {
    res.render("blog");
});

app.get("/contact", function(req, res) {
    res.render("contact");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Launched!");
});