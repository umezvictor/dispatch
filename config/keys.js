//mobgodb connection
module.exports = {
    //MongoURI: 'mongodb+srv://victorblaze:D1PW36btWDhhAFsP@cluster0-ygkqe.mongodb.net/test?retryWrites=true',
    
    //MongoURI: 'mongodb://victorblaze:#1989Vic.@ds123645.mlab.com:23645/companiesdb',
    MongoURI: 'mongodb://localhost:27017/dispatchDB',
    URL: process.env.BASE_URL || 'http://localhost:3050',
    ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'mypassword',
    SendGridKey1: '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'
};
