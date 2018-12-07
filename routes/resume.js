var express = require("express");
var router = express.Router();

//===================================================
// Resume Routes
//===================================================

router.get("/resume", function(req, res) {
    res.render("resume");
});

module.exports = router;