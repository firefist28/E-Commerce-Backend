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

const router = express.Router();

// Defining routes
router.post('/', validateToken, addProduct);
router.get('/', validateToken, getProducts);
router.get('/:id', validateToken, getProductById);
router.put('/:id', validateToken, updateProduct);
router.delete('/:id', validateToken, deleteProduct);
router.get('/search/:key', validateToken, searchProduct);

module.exports = router;
