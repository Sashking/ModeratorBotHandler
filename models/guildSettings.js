const mongoose = require('mongoose');

module.exports = mongoose.model('guild-settings', mongoose.Schema({
    GuildID: String,
    AuditChannelID: String,
    LinkProtection: Boolean,
}));
