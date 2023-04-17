const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const auth = require('../controllers/authController');


router.get('/signup', catchAsync(auth.signup_get))

router.post('/signup', catchAsync(auth.signup_post))

router.get('/login', catchAsync(auth.login_get))

router.post('/login', catchAsync(auth.login_post))

router.get('/logout', catchAsync(auth.logout))

module.exports = router;