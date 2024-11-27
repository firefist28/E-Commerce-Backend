const express = require('express');
const { addToOrder, getOrder } = require('../controllers/orderController');
const validateToken = require('../middlewares/validateToken');
const authorizeRoles = require('../middlewares/validateRole');

const router = express.Router();
router.post('/', validateToken, authorizeRoles('user'), addToOrder);
router.get('/:id', validateToken, authorizeRoles('user'), getOrder);

module.exports = router;