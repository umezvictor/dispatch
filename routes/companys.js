const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { ensureAuthenticated } = require('../config/auth');

//COMPANIES API

//get all companies
router.get('/companys', async(req, res) => {
    try {
              const company = await Company.find({});
              
              res.send(company);
              
               
            } catch (err) {
                res.send({error_msg: 'no record found'});//use an error handler later
            }
});


//get single company by name
router.get('/companys/:name', async(req, res) => {
    try {
        
        const companyName = req.params.name;
        const pattern = new RegExp(companyName, "i");//get any record that begins with or contains what the user typed from the dbase
        const company = await Company.find().where('name').equals(pattern);
            if(company){
                res.send(company);
            }
    } catch (error) {
        res.send({msg: 'oops, something went wrong'})
    }
  
  
});



//add company
router.post('/companys', ensureAuthenticated, async (req, res) => {
    //check if request body is json
    if(!req.is('application/json')){
        res.send({msg: "only json format allowed"});
    }

        const { name, location, phone, email, website, services } = req.body;//destructuring es6 format
    //create new Company object
        const company = new Company({
            name,
            location,
            phone,
            email,
            website,
            services
        });
        
        //save to db
        try {
            const  newCompany = await company.save();
            res.sendStatus(201);//ok 
        } catch (err) {
            res.send({msg: "data was not saved to db"});
        }
});


//get single company
router.get('/companys/:id', ensureAuthenticated, async(req, res) => {

    try {
        const company = await Company.findById(req.params.id);
        res.send(company);
    } catch (error) {
        res.send({msg: "could not find any company with that id"})
    }
});


//update company
router.put('/companys/:id', ensureAuthenticated, async(req, res) => {
    //check if data is json format
    if(!req.is('application/json')){
        res.send({msg: "only json format allowed"})
    }

    //update data by id, id field must match the id in the url query parameter
    try {
        const company = await Company.findByIdAndUpdate({_id: req.params.id}, req.body);
        res.sendStatus(200);//ok
    } catch (error) {
        res.send({msg: "Update failed"});
    }
});

//delete company
router.delete('/companys/:id', ensureAuthenticated, async(req, res) => {
    try {
        const company = await Company.findOneAndRemove({_id: req.params.id});
        res.sendStatus(204);//delete successful
    } catch (error) {
        res.send({msg: "delete failed"});
    }
});


//API DOCUMENTATION

//api methods or endpoints
router.get('/documentation/api-methods', ensureAuthenticated, (req, res) => res.render('apiPages/index', {
    name: req.user.name
}));

//api endpoint - companys -- shows how to use the endpoint
router.get('/documentation/show-companies', ensureAuthenticated, (req, res) => res.render('apiPages/all-companies', {
    name: req.user.name
}));

//api endpoint - companys/name -- shows how to get company name
router.get('/documentation/company-name', ensureAuthenticated, (req, res) => res.render('apiPages/company-name', {
    name: req.user.name
}));
module.exports = router;
