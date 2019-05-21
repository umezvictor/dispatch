const express = require('express');
const router = express.Router();
//const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const nodemailer = require ('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/keys');
//const xoauth2 = require('xoauth2');
//home page
router.get('/', (req, res) => res.render('home'));

//contact form
router.get('/contact', (req, res) => res.render('contact-form'));

//submit contact form
//contact form
router.post('/contact', (req, res) => {

      const output = `
    <p>You have a new message</p>
    <h3>Contact details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
`;

  const transporter = nodemailer.createTransport(sendgridTransport({
      auth: {
          api_key: config.SendGridKey1
      }
  }));

  const mailOptions = {
    to: 'victorblaze2010@gmail.com',
    from: req.body.email,
    subject: 'New User Message',
    html: output
    };
    
  //send mail
  transporter.sendMail(mailOptions, function(err, res) {
    if(err){
      console.log('error occured');
    } else{
      console.log('email sent');
    }
  });
  req.flash( 'success_msg', 'your message has been sent successfully' );
  res.redirect('/contact');

 });


//admin dashboard --  protected route
router.get('/admin-dashboard', ensureAuthenticated, (req, res) => res.render('admin-dashboard', {
    //pass in the user credentials, so we can display in dshboard
    name: req.user.name
}));
//user dashboard protected route
//pass in the user credentials, so we can display in dshboard
router.get('/userWelcome', ensureAuthenticated, (req, res) => res.render('userWelcome', {
    name: req.user.name
}));

//welcome page after developer user logs in to view api resources
router.get('/user', ensureAuthenticated, (req, res) => res.render('apiPages/index', {
    //pass in the user credentials, so we can display in dshboard
    name: req.user.name
}));

module.exports = router;