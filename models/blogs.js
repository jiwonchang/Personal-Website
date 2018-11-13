var mongoose = require("mongoose");

// blog schema
var blogSchema = new mongoose.Schema({
    category: String,
    title: String,
    image: {type: String, default: "https://i.kinja-img.com/gawker-media/image/upload/s--gNscB14c--/c_scale,f_auto,fl_progressive,q_80,w_800/18j2u6zfdsj9bjpg.jpg"},
    video: String,
    body: String,
    created: {type: Date, default: Date.now}
});

// blog model
var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

  // creates a blog object and saves it into our database
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1538523396059-8145b69118c4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a33b59b20f6b6efcd88bdd73b1cb84c2&auto=format&fit=crop&w=701&q=80",
//     body: "THIS IS A TEST BLOG!"
// });