const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            // If the cart exists, check if the product is already in the cart
            const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (productIndex > -1) {
                // Product exists in cart, update quantity
                cart.items[productIndex].quantity += quantity;
            } else {
                // Product doesn't exist, add it to the cart
                cart.items.push({ productId, quantity });
            }
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding to cart' });
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('user id for cart ' + userId);

        // Find the cart for the user
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log('user id for cart ' + userId);
        const itemId = req.body.itemId;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        } else {
            const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }
            // Removing the item from the cart's items array
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.status(200).json({ message: 'Item removed successfully', cart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the cart' });
    }
};
