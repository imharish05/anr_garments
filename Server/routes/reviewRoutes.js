'use strict';
const router = require('express').Router();
const {
  getPublicReviews,
  getProductReviews,
  getMyDeliveredItems,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
} = require('../controllers/reviewController');
const { verifyCustomer, verifyAdmin, optionalCustomer } = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');
const { writeActionLimiter } = require('../middleware/rateLimiter');

// Public reviews listing for storefront
router.get('/', getPublicReviews);

// Admin routes (must be before generic /:id routes)
router.get('/admin/all', verifyAdmin, hasPermission('view_reviews'), getAllReviewsAdmin);
router.patch('/admin/:id/status', verifyAdmin, hasPermission('view_reviews'), updateReviewStatusAdmin);
router.delete('/admin/:id', verifyAdmin, hasPermission('delete_review'), deleteReview);

// Customer routes
router.get('/product/:productId', optionalCustomer, getProductReviews);
router.get('/my-delivered-items', verifyCustomer, getMyDeliveredItems);
router.post('/', writeActionLimiter, verifyCustomer, createReview);
router.put('/:id', writeActionLimiter, verifyCustomer, updateReview);
router.delete('/:id', writeActionLimiter, verifyCustomer, deleteReview);

module.exports = router;

