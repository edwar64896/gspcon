var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
		if (req.isAuthenticated()) {
				console.log(req.user);
		}
		var pageData = {
				isAuthenticated: req.isAuthenticated(),
				user:req.user

		};
		res.render('index', { pageData: pageData });
});

router.get('/login', function(req, res, next) {
		res.render('login', { title: 'LoginForm' });
});

router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
});

router.get('/teacher', function(req, res, next) {
		if (req.isAuthenticated()) {
				res.render('teacher', { title: 'Teacher' , username: req.user.username});
		} else {
				res.redirect('/');
		}
});

router.get('/pupil', function(req, res, next) {
		res.render('pupil', { title: 'Pupil' });
});

router.get('/admin', function(req, res, next) {
		res.render('admin', { title: 'Admin' });
});

router.get('/api/users/me',
		passport.authenticate('basic', {session:false}),
		function(req,res) {
				res.json({id:req.user.id, username:req.user.username});
		});


router.post('/login', 
		passport.authenticate('local', { 
				successRedirect: '/',
				failureRedirect: '/loginform',
				failureFlash: false })
);


module.exports = router;
