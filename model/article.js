var mongoose = require('mongoose')

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Artice Database connection successful'))
    .catch(() => console.log('Artice Database connection failed'));

var articeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    classify: {
        type: String,
        default: 'Other'
    },
    date: {
        type: Date,
        // 2021-04-09T13:40:29.057Z 这是UTC格式
        default: Date.now
    }
});

module.exports = mongoose.model('Artice', articeSchema);