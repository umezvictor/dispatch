const express = require('express');
const router = express.Router();
//const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const nodemailer = require ('nodemailer');
const xoauth2 = require('xoauth2');
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

  const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            //host: 'mail.zubar.com.ng',
            port: 587,
            secure: false,
            auth: {
                user: 'victorblaze2010@gmail.com',
                pass: 'boninheaven'
                
            },
            tls:{
                rejectUnauthorized: false //when sending from localhost
            }
        });
    
        
    //setup mail data
    const mailOptions = {
        from: '"Nodemailer contact" <victorblaze2010@gmail.com>', //sender address
        to: 'umezvictor123@gmail.com', //same as user, or list of receivers
        subject: 'Contact form request',
        text: 'hello', //plai
        html: output //html body
    };
    
    //send mail with transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return (console.log(error));
        }
    
        console.log('Mesage sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        //req.flash('success_msg', 'Your message has been sent successfully');
        res.render('/contact');
    });

  // var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     xoauth2: xoauth2.createXOAuth2Generator({
  //       user: 'victorblaze2010@gmail.com',
  //       clientId: '30739813491-ii29v5ift5blrg5lg4jks9pb7je6dq6n.apps.googleusercontent.com',
  //       clientSecret: '3CSHvhysnC1NEYM7a2ctaefq',
  //       refreshToken: ''
  //     })
  //   }
  // });//end of transporter

  // //mail options
  // var mailOptions = {
  //   from: 'Victor <victorblaze2010@gmail.com>',
  //   to: 'umezvictor123@gmail.com',
  //   subject: 'Nodemailer mail test',
  //   text: 'hello bro'
  // } 

  // //send mail
  // transporter.sendMail(mailOptions, function(err, res) {
  //   if(err){
  //     console.log('error occured');
  //   } else{
  //     console.log('email sent');
  //   }
  // });

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