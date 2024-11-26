const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const validateToken = require('../middlewares/validateToken');
const authorizeRoles = require('../middlewares/validateRole');

const router = express.Router();
router.post('/', validateToken, authorizeRoles('user'), addToCart);
router.get('/:id', validateToken, authorizeRoles('user'), getCart);
router.post('/remove', validateToken, authorizeRoles('user'), removeFromCart);

module.exports = router;