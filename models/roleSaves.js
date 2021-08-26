const mongoose = require('mongoose');

module.exports = mongoose.model('role-save', mongoose.Schema({
    GuildID: String,
    UserID: String,
    Roles: Array
}));