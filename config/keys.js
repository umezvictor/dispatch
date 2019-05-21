//mobgodb connection
module.exports = {
    //MongoURI: 'mongodb+srv://username:D1PW36btWDhhAFsP@cluster0-ygkqe.mongodb.net/test?retryWrites=true',
    
    //MongoURI: 'mongodb://myusername:mypassword@ds123645.mlab.com:23645/companiesdb',
    MongoURI: 'mongodb://localhost:27017/dispatchDB',//my local connection using atlas
    URL: process.env.BASE_URL || 'http://localhost:3050',
    ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || '****',
    SendGridKey1: '*****'
};
