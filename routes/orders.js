import { Router } from 'express';
import Order from '../models/order.js';
import Cart from '../models/cart.js';

const router = Router();

// GET all orders
router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                orders: [],
                message: 'No orders found in DB.'
            });
        }
        res.status(200).json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        next(error);
    }
});


// GET orders by userId
router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;

  if (global.user && userId !== global.user.userId) {
      return res.status(403).json({ success: false, message: 'You can only see your own orders.' });
  }

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error); 
  }
});

// POST orders
router.post('/', async (req, res, next) => {
    const { cartId } = req.body; // Samma som userId

    if (!cartId) {
        return res.status(400).json({ success: false, message: 'No cartId in body.' });
    }

    try {
        // Hämta den faktiska användaren från global.user om inloggad, annars från cartId
        let actualUserId;
        if (global.user) {
            actualUserId = global.user.userId;

            if (cartId !== actualUserId) {
                return res.status(403).json({ success: false, message: 'Error: You can only create an order from your own cart.' });
            }
        } else {
            actualUserId = cartId; // För gäster är cartId = gäst-ID
        }

        // Hitta kundvagn
        const cart = await Cart.findOne({ userId: actualUserId }); // userId här

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart not found or empty.' });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        const newOrder = new Order({
            userId: actualUserId,
            items: cart.items.map(item => ({
                prodId: item.prodId,
                title: item.title,
                price: item.price,
                qty: item.qty
            })),
            total: total
        });

        await newOrder.save();

        // Tömmer kundvagnen efter att ordern har lagts
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            order: {
                userId: newOrder.userId,
                items: newOrder.items,
                total: newOrder.total,
                createdAt: newOrder.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        next(error);
    }
});

export default router;