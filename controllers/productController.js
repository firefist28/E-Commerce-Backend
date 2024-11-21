const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const result = await product.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// Get all products (with pagination)
exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments();

        if (products.length > 0) {
            res.json({
                data: products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
            });
        } else {
            res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

//search product with key
exports.searchProduct = async (req, res) => {
    try {
        const result = await Product.find({
            "$or": [
                { name: { $regex: req.params.key, $options: 'i' } }, //Case-insensitive
                { company: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } }
            ]
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error Searching product', error: error.message });
    }
};