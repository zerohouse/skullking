const bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("abc", salt);

console.log(hash);console.log(bcrypt.compareSync("abc", hash));