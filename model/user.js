var mongoose = require('mongoose')

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('User Database connection successful'))
    .catch(() => console.log('User Database connection failed'));

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        // 2021-04-09T13:40:29.057Z 这是UTC格式
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);