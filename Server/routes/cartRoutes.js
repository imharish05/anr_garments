'use strict';
const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart, mergeCart } = require('../controllers/cartController');
const { optionalCustomer, verifyCustomer } = require('../middleware/auth');
const { writeActionLimiter } = require('../middleware/rateLimiter');

router.get('/', optionalCustomer, getCart);
router.post('/add', writeActionLimiter, optionalCustomer, addToCart);
router.post('/sync', writeActionLimiter, optionalCustomer, syncCart);
router.post('/merge', writeActionLimiter, verifyCustomer, mergeCart);
router.put('/item/:itemId', writeActionLimiter, optionalCustomer, updateCartItem);
router.delete('/item/:itemId', writeActionLimiter, optionalCustomer, removeFromCart);
router.delete('/clear', writeActionLimiter, optionalCustomer, clearCart);

module.exports = router;
