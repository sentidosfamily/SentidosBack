const express = require('express');
const router = express.Router();
const { sendVerificationCode, changePassword } = require('../controllers/changePasswordController');

router.post('/sendCode', sendVerificationCode);
router.post('/changePassword', changePassword);

module.exports = router;
