const bcrypt = require('bcryptjs');
const mongoose = require('../mongoose.connect');

const emailField = mongoose.regexField(String, "(.+)@(.+){2,}\.(.+){2,}", "{VALUE}는 이메일형식에 맞지 않습니다.");
emailField.unique = true;

const userSchema = mongoose.Schema({
    email: emailField,
    name: mongoose.regexField(String, ".{2,}", "이름은 두글자 이상으로해주세요."),
    password: String,
    ranks: [],
    point: {type: Number, default: 0}
});

const User = mongoose.model('User', userSchema);

User.prototype.encryptPassword = function () {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
};

User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = User;