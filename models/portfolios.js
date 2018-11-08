var mongoose = require("mongoose");

var portfolioSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "https://i.kinja-img.com/gawker-media/image/upload/s--gNscB14c--/c_scale,f_auto,fl_progressive,q_80,w_800/18j2u6zfdsj9bjpg.jpg"},
    body: String,
    created: {type: Date, default: Date.now},
    type: String
});

var Portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = Portfolio;

  // creates a portfolio object and saves it into our database
// Portfolio.create({
//     title: "Test Portfolio Entry",
//     image: "https://images.unsplash.com/photo-1538523396059-8145b69118c4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a33b59b20f6b6efcd88bdd73b1cb84c2&auto=format&fit=crop&w=701&q=80",
//     body: "THIS IS A TEST Portfolio Entry!"
// });