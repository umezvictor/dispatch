const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts'); 
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());//important for api route

//passport config
require('./config/passport')(passport);
//passport-jwt  for securing route
//require('./config/auth2')(passport);

//db config 
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);//prevents deprecation warning

app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended: false }));

//set public directory - serve static files
app.use(express.static(__dirname + '/public'));

//express session for storing flash messages
app.use(session({
    secret: 'mysecret',
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


const PORT = process.env.PORT || 3050;
//start server
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

