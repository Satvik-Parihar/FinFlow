const express = require('express');
const router = express.Router();
const { signup, signin, setPassword, forgotPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/set-password', setPassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;