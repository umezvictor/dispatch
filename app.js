const express = require('express');//web framework
const mongoose = require('mongoose');//for database interaction
const expressLayouts = require('express-ejs-layouts'); 
const flash = require('connect-flash');//flash messages, success_msg, error_msg, etc
const session = require('express-session');//managing sessions
const passport = require('passport');//for authentication, has several strategies, local was used here
const bodyParser = require('body-parser');//for pulling out request body, eg req.body.name


const app = express();//init express

//middleware that allows json response from api to be returned
app.use(bodyParser.json());//important for api route

//passport config
require('./config/passport')(passport);
//passport-jwt  for securing route


//Mongodb connection string 
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);//prevents deprecation warning

//middleware for ejs template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended: false }));

//set public directory - serve static files, change public to the location of your front end framework (eg react) if not using ejs or the likes
app.use(express.static(__dirname + '/public'));

//express session for storing flash messages
app.use(session({
    secret: 'mysecret',//can be any word apart from mysecret
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//
//connect flash 
app.use(flash());

//global variables for error and success messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');//flash for passport
    next();
});


//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/companys'));

//port number for production or development
const PORT = process.env.PORT || 3050;
//start server
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

