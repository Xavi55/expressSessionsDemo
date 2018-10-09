const mongoose = require('mongoose');
const URI = 'mongodb://xavi55:abc123@ds115768.mlab.com:15768/logins';
mongoose.connect(URI, {useNewUrlParser:true})
.then(db => 
    {
        console.log('mongoDB OKAY')
    })
.catch(err =>
    {
        console.log('mongoDB err:',err);
    });
module.exports = mongoose;