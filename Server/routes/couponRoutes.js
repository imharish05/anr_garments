'use strict';
const router = require('express').Router();
const { getAll, create, update, remove, validate } = require('../controllers/couponController');
const { verifyAdmin, optionalCustomer } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { couponLimiter } = require('../middleware/rateLimiter');

router.get('/', optionalCustomer, getAll);
router.post('/', verifyAdmin, hasPermission('add_coupon'), create);
router.put('/:id', verifyAdmin, hasPermission('edit_coupon'), update);
router.delete('/:id', verifyAdmin, hasPermission('delete_coupon'), remove);
router.post('/validate', couponLimiter, optionalCustomer, validate);

module.exports = router;
