const mongoose = require("mongoose");

module.exports = (mongo) => {
    const mongooseConnectionString = mongo;
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString, {
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(() => console.log('✅ MongoDB'));
};