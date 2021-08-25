const mongoose = require('mongoose');

module.exports = mongoose.model('guild-settings', mongoose.Schema({
    GuildID: String,
    LinkProtection: Boolean,
    MuteRoleID: String,
}));
