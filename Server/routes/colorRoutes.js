'use strict';
const router = require('express').Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
  reorder,
  seed,
} = require('../controllers/colorController');
const { verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route for Client (returns active colors sorted by sortOrder)
// Supports ?all=true for Admin
router.get('/', getAll);
router.get('/seed', seed);
router.post('/seed', seed);
router.get('/:id', getById);

// Protected Admin CRUD routes
router.post('/', verifyAdmin, upload.single('image'), create);
router.patch('/reorder', verifyAdmin, reorder);
router.put('/:id', verifyAdmin, upload.single('image'), update);
router.delete('/:id', verifyAdmin, remove);

module.exports = router;
