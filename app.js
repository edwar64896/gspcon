const { v4: uuidv4 } = require('uuid');
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require('url');
var minimist = require('minimist');
//var ws = require('ws');
//var kurento = require('kurento-client');
var fs    = require('fs');
var https = require('https');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

/*
 * setup REDIS
 */
const Rebridge = require('rebridge');
const redis = require('redis');
const rbclient = redis.createClient();
const db = new Rebridge(rbclient, {
		mode: "deasync"
});


/*
 * setup Express and routers
 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
		genid: (req) => {
				console.log('inside session middleware genid function');
				console.log(`Request object sessionID from client: ${req.sessionID}`);
				return uuidv4();
		},
		secret: 'dogs' }));

/*
 * setup view engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
		next(createError(404));
});

/*
 * setup error handler
 */
app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
});

/*
 * setup PASSPORT
 */
passport.use(new LocalStrategy(
		function(uname, pword, done) {
				console.log ("uname = "+uname+" pword = "+pword+"<<");
				const user=db.users.find(element => element.username === uname);
				console.log("passport user: "+JSON.stringify(user));
				if (!user) {
						return done(null, false, { message: 'Incorrect username.' });
				}
				if (!bcrypt.compareSync(pword, user.password)) {
						return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
		}
));

passport.serializeUser(function(user, done) {
		done(null, user.id);
});

passport.deserializeUser(function(id, done) {
		const user=db.users.find(element => element.id === id);
		if (!user) {
				return done(null,false);
		} else {
				return done(null,user);
		}
});

module.exports = app;
