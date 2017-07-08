const bcrypt = require('bcryptjs');
const mongoose = require('../mongoose.connect');

const emailField = mongoose.regexField(String, "(.+)@(.+){2,}\.(.+){2,}", "{VALUE} is not a valid email.");
emailField.unique = true;

const userSchema = mongoose.Schema({
    email: emailField,
    name: mongoose.regexField(String, ".{2,}", "name must longer then 2 chars."),
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