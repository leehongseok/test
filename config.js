var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var app = express();
 
// handlbars
var exphbs  = require('express-handlebars');
var exphbsHelper = require('./app.helper');
app.engine('hbs', exphbs({
  extname:'hbs',
  defaultLayout:'base',
  layoutDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: exphbsHelper,
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// app.enable('view cache'); //cache 사용 
// app.use(logger('tiny')); //dev


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss 
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
 
//passport
var passport = require('passport') //passport module add
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash'); // session 관련해서 사용됨. 로그인 실패시 session등 클리어하는 기능으로 보임.
var cookieSession = require('cookie-session');
app.use(cookieSession({
  keys: ['itbox'],
  cookie: {
    maxAge: 100 * 60 * 60 * 24 * 30// 쿠키 유효기간 1시간  *24시간 * 30일 
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// route
var routes = require('./app.routes'); 
app.use('/', routes);
var authRoutes = require('./routes/auth'); 
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
// 여기까지와도 route못찾은거면 페이지 없음 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); //에러페이지
});

module.exports = app;
