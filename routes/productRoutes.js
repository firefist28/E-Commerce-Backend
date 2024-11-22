const express = require('express');
const {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProduct
} = require('../controllers/productController');
const validateToken = require('../middlewares/validateToken');
const authorizeRoles = require('../middlewares/validateRole');

const router = express.Router();

// Defining routes
router.post('/', validateToken, authorizeRoles('admin'), addProduct);
router.get('/', validateToken, authorizeRoles('admin', 'user'), getProducts);
router.get('/:id', validateToken, authorizeRoles('admin', 'user'), getProductById);
router.put('/:id', validateToken, authorizeRoles('admin'), updateProduct);
router.delete('/:id', validateToken, authorizeRoles('admin'), deleteProduct);
router.get('/search/:key', validateToken, authorizeRoles('admin', 'user'), searchProduct);

module.exports = router;
