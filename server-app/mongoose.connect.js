const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
mongoose.connect('mongodb://funny.gg:27017/skull',
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
    scheme.required = [true, "{PATH} 필드가 필요합니다."];
    return scheme;
};

module.exports = mongoose;