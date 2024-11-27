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

exports.getOrder = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('user id for order ' + userId);

        // Find the cart for the user
        const orders = await Order.find({ userId }).populate('items.productId', 'name');

        if (!orders) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the order' });
    }
};