const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    company: String,
    isDeleted: Boolean
});

module.exports = mongoose.model('products', productSchema);