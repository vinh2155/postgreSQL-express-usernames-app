const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET / - log available usernames in the DB to the terminal
router.get('/', userController.getUsernames);

// GET /new - display HTML form to add username
router.get('/new', userController.showUsernameForm);

// POST /new - save incoming username data to the DB
router.post('/new', userController.saveUsername);

// GET /delete - delete all usernames from the DB
router.get('/delete', userController.deleteAllUsernames);

module.exports = router;
