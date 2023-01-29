// test-main rest api 
const express = require("express");
const cors = require('cors');
const app = express();

// 세션 설정
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./routes/passport'); // 여기
const UserRoute = require("./routes/user_routes.js");

var cookieParser = require('cookie-parser');
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
const swaggerOption = require("./swagger/swagger.js")
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:path.join(__dirname,"/./../enviroment/.env")});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3907',
  credentials: true
}));

app.use(cookieParser());

app.use(session({ 
  secret: 'SECRET_KEY', 
  resave: true, 
  saveUninitialized: false
})); // 세션 활성화
app.use(passport.initialize());   // passport 구동
app.use(passport.session());      // 세션 연결
passportConfig();

app.use("/api/user", UserRoute);

app.get("/api", (req, res) => {
    res.json({
      success: true,
    });
  });

const specs = swaggerJsdoc(swaggerOption);
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {explorer: true})
);


//- catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//- error handler
app.use(function(err, req, res, next) {
  //- set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //- render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.TEST_SERVER_PORT, () => console.log("server start"));
