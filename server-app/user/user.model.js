const mongoose = require('../mongoose.connect');

var emailField = mongoose.regexField(String, "(.+)@(.+){2,}\.(.+){2,}", "{VALUE}는 이메일형식에 맞지 않습니다.");
emailField.unique = true;

const userSchema = mongoose.Schema({
    email: emailField,
    name: mongoose.regexField(String, ".{2,}", "이름은 두글자 이상으로해주세요."),
    password: String
});

const User = mongoose.model('User', userSchema);
const bcrypt = require('bcrypt');

User.encrypt = function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
};

User.prototype.compare = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isPasswordMatch) {
        return callback(err, isPasswordMatch);
    });
};

module.exports = User;