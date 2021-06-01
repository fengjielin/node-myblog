var mongoose = require('mongoose')

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Log Database connection successful'))
    .catch(() => console.log('Log Database connection failed'));

var logSchema = new Schema({
    who: {
        type: String,
        required: true
    },
    where: {
        type: String,
        required: true
    },
    what: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        // 2021-04-09T13:40:29.057Z 这是UTC格式
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);