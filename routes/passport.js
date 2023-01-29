
const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

const mysql = require("../database/connect.js");

module.exports = () => {
    // Strategy 성공 시 호출됨
    passport.serializeUser((user, done) => {
        console.log('serr ', user);
        
        const data = {
            email: user.email,
            password: user.password,
            nickname: user.nickname
        }
        done(null, data); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
    });

    // 페이지를 방문할때마다 세션스토어에서 가져와서
    passport.deserializeUser((user, done) => {
        // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
        console.log('deserr ', user);
        
        done(null, user);   // 여기의 user가 req.user가 됨
    });

    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: true,
            passReqToCallback: false
        },
        function (email, password, done) {
            // 아이디+비번 동시 찾는 방식임. 만약 비밀번호만 틀린 경우를 알고 싶다면 쿼리 분리
            mysql.query(`SELECT * FROM USER WHERE email=${email} AND password=${password}`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return done(err);
                }
                else if (res.length == 0) {
                    console.log("결과 없음");
                    return done(null, false, {message:'Incorrect'});
                } else {
                    console.log(res);

                    var json = JSON.stringify(res[0]);
                    var userinfo = JSON.parse(json);
                    console.log("userinfo " + userinfo);

                    return done(null, userinfo);
                }
            });
            }
        )
    )
};