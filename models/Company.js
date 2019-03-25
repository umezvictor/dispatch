const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: [{}],
    phone: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        required: false
    },
    services: [String]
});

//create timestamp
CompanySchema.plugin(timestamp);

//create Company model

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;