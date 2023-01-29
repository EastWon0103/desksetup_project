const User = require("../model/user_model.js");

exports.findAll = function(req, res){
    User.findAll((err,user)=>{
        if(err) res.send(err);
        res.json(user);
    })
}

exports.findByEmail = function(req, res){
    User.findByEmail(req.params.email, (err, user) => {
        if (err) res.send(err);
        res.json(user);
    });
}

exports.userSignUp = function(req, res){
    const { nickname, email, password, phone, authtype, usertype } = req.body;
    User.create(nickname, email, password, phone, authtype, usertype, (err, user)=>{
        if (err) res.send(err);
        res.json({
            "isSuccess": true,
            "result" : [
                user
            ]
        });
    });
}

exports.login = function(req, res, next){
    const { email, password } = req.body;
    User.login(req, res, next);

    // User.login((err, user)=>{
    //     if (err) res.send(err);
    //     res.json({
    //         "isSuccess": true,
    //         "result" : [
    //             user
    //         ]
    //     });
    // }, req, res, next);
}

exports.autologin =  function(req, res) {
    
    console.log(req.isAuthenticated());
    console.log(req.user);
    console.log('serrs ', req.session);

	if (req.isAuthenticated() && req.user) {    
		res.json({ 
            success: true,
            user: req.user
        });
        return;
	}

	res.json({
        success: false,
        user: null
    });
}

exports.logout = function(req, res) {
    // req.logout();
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({
            "isSuccess": true,
            "result" : "LOGOUT"
        });
    });
    // return res.json({
    //     "isSuccess": true,
    //     "result" : "LOGOUT"
    // });
}


exports.findT = function(req, res){
    User.findT((err,user)=>{
        if(err) res.send(err);
        res.json(user);
    })
}
