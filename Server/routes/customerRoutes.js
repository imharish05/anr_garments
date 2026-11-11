'use strict';
const router = require('express').Router();
const { getAll, getOne, getWishlist, toggleWishlist, syncWishlist, getTickets, createTicket } = require('../controllers/customerController');
const addressController = require('../controllers/addressController');
const { verifyCustomer, verifyAdmin } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { writeActionLimiter } = require('../middleware/rateLimiter');

// Saved addresses handler (backed by CustomerAddress DB model)
router.get('/addresses', verifyCustomer, addressController.listAddresses);
router.post('/addresses', writeActionLimiter, verifyCustomer, addressController.createAddress);
router.get('/addresses/:addressId', verifyCustomer, addressController.getAddress);
router.put('/addresses/:addressId', writeActionLimiter, verifyCustomer, addressController.updateAddress);
router.put('/addresses/:addressId/default', writeActionLimiter, verifyCustomer, addressController.setDefaultAddress);
router.delete('/addresses/:addressId', writeActionLimiter, verifyCustomer, addressController.deleteAddress);

// Customer self-service routes
router.get('/wishlist', verifyCustomer, getWishlist);
router.post('/wishlist', writeActionLimiter, verifyCustomer, toggleWishlist);
router.post('/wishlist/sync', writeActionLimiter, verifyCustomer, syncWishlist);
router.get('/tickets', verifyCustomer, getTickets);
router.post('/tickets', writeActionLimiter, verifyCustomer, createTicket);

// Admin-only routes
router.get('/', verifyAdmin, hasPermission('view_customers'), getAll);
router.get('/:id', verifyAdmin, hasPermission('view_customers'), getOne);

module.exports = router;
