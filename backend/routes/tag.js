const express = require('express');
const router = express.Router();

// controllers
const {create, list, read, remove} = require('../controllers/tag');
const {requireSignin, adminMiddleware} = require('../controllers/auth');

// validators
const {runValidation} = require('../validators');
const {tagCreateValidator } = require('../validators/tag');

router.get('/tag', tagCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
