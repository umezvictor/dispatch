//here I used a pasport method for conditional rendering of pages
//redirects user to login page if not authenticated
//we can add ensureAuthenticated to any view we want to protect
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();//req.isAuthenticated is gotten from passport
        }
        req.flash('error_msg', 'Please login to view this resource');
        res.redirect('/users/login');
    }
}

