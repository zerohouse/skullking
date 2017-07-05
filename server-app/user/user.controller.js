const User = require('./user.model');

module.exports = function (app) {

    app.get('/api/user', function (req, res) {
        res.send(req.session.user);
    });

    app.get('/api/user/logout', function (req, res) {
        delete req.session.user;
        res.send({});
    });

    app.post('/api/user/login', function (req, res) {
        let u = req.body;
        User.findOne({email: u.email}, ecb(user => {
            if (user === null) {
                res.sendError("가입하지 않은 계정입니다.");
                return;
            }
            user.compare(u.password, ecb(result => {
                if (!result) {
                    res.sendError("패스워드가 다릅니다.");
                    return;
                }
                req.session.user = user;
                res.send(user);
            }));
        }));
    });

    app.post('/api/user', function (req, res) {
        let user = req.body;
        User.encrypt(user.password, ecb(password => {
            user.password = password;
            user = new User(user);
            user.save(ecb(function (user) {
                req.session.user = user;
                res.send(user);
            }));
        }));
    });


};

function ecb(cb) {
    return function (err, value) {
        if (err) {
            cb(err);
            return;
        }
        cb(value);
    }
}