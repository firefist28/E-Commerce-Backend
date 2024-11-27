const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.addToOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const { totalAmount } = req.body;
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price');
        if (!cart) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
        });

        await order.save();
        //clearing cart after purchase
        await Cart.deleteOne({ userId });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}