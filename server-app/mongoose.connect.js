const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
const url = process.platform === 'linux' ? '127.0.0.1' : "funny.gg";
mongoose.connect(`mongodb://${url}:27017/skull`,
    {
        useMongoClient: true
    }
);
mongoose.regexField = function (type, regex, message) {
    const scheme = {};
    scheme.type = type;
    if (!regex)
        return;
    scheme.validate = {
        validator: function (v) {
            return new RegExp(regex).test(v);
        },
        message: message
    };
    scheme.required = [true, "{PATH} field required."];
    return scheme;
};

module.exports = mongoose;