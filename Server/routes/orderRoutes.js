'use strict';
const router = require('express').Router();
const { getAll, getOne, getMyOrders, getMyOrderById, trackOrder, placeOrder, cancelMyOrder, updateStatus, getDashboardStats, getStatusCounts } = require('../controllers/orderController');
const { verifyCustomer, verifyAdmin, optionalCustomer } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { orderLimiter } = require('../middleware/rateLimiter');

router.get('/stats', verifyAdmin, hasPermission('view_orders'), getDashboardStats);
router.get('/status-counts', verifyAdmin, hasPermission('view_orders'), getStatusCounts);
router.get('/track/:identifier', orderLimiter, optionalCustomer, trackOrder);
router.get('/my', verifyCustomer, getMyOrders);
router.get('/my/:id', verifyCustomer, getMyOrderById);
router.post('/my/:id/cancel', orderLimiter, verifyCustomer, cancelMyOrder);
router.post('/:id/cancel', orderLimiter, verifyCustomer, cancelMyOrder);
router.post('/', orderLimiter, optionalCustomer, placeOrder); // allow optional guest order placement
router.get('/', verifyAdmin, hasPermission('view_orders'), getAll);
router.get('/:id', verifyAdmin, hasPermission('view_orders'), getOne);
router.patch('/:id/status', verifyAdmin, hasPermission('update_orders'), updateStatus);
router.put('/:id/status', verifyAdmin, hasPermission('update_orders'), updateStatus);

module.exports = router;
