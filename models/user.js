/**
 * Created with IntelliJ IDEA.
 * User: user
 * Date: 9/12/13
 * Time: 12:38 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.development.dbUrl);

var userSchema = new mongoose.Schema({
    fbId: String,
    name: String,
    username: String,
    first_name: String,
    last_name: String,
    email: {type: String, lowercase: true},
    gender: String,
    bio: String,
    birthday: String,
    friends: Object,
    hometown: Object,
    location: Object,
    favorite_teams: Object
});

module.exports = mongoose.model('user', userSchema);
