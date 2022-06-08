const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passportLocalMongoose) 
//it's gonna add on our Schema a username, a field for password, it's gonna make sure the usernames are unique, not duplicated,
// and it's gonna add some methods to the Schema

module.exports = mongoose.model('User', userSchema)