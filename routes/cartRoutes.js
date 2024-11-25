const express = require('express');
const { addToCart, getCart } = require('../controllers/cartController');
const validateToken = require('../middlewares/validateToken');
const authorizeRoles = require('../middlewares/validateRole');

const router = express.Router();
router.post('/', validateToken, authorizeRoles('user'), addToCart);
router.get('/:id', validateToken, authorizeRoles('user'), getCart);

module.exports = router;