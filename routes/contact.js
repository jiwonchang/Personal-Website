var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

// contact me routes ************************
router.get("/contact", function(req, res) {
    res.render("contact");
});

router.post("/contact", function(req, res) {
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

module.exports = router;