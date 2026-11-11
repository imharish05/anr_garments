'use strict';
const router = require('express').Router();
const { autocomplete, trending, track } = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');

router.get('/autocomplete', searchLimiter, autocomplete);
router.get('/trending', searchLimiter, trending);
router.post('/track', searchLimiter, track);

module.exports = router;
