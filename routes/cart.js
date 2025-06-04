import Cart from '../models/cart.js';
import Router from 'express';
import { getProduct, updateCart } from '../services/cart.js';
import { v4 as uuid } from 'uuid';

const cartRouter = Router();

// GET all carts
cartRouter.get('/', async(req, res,) => {
    const result = await Cart.find()
    if(result) {
        res.json({
            success: true,
            cart: result 
        })
    } else {
        next({
            status: 404,
            message: 'No Carts found'
        })
    }
})

// GET cart by userId
cartRouter.get('/:userId', async (req, res, next) => {
    const requestedUserId = req.params.userId;

    console.log('GET /api/cart/:userId requested for:', requestedUserId);
    console.log('global.user (if logged in):', global.user);

    if (global.user) {
        if (requestedUserId !== global.user.userId) {
            return res.status(403).json({ success: false, message: 'You can only see your own cart.' });
        }
    }

    try {
        const cart = await Cart.findOne({ userId: requestedUserId });
        console.log('Cart found in DB:', cart);

        if (!cart) {
            console.log('No cart found for userId:', requestedUserId);
            return res.status(200).json({ success: true, items: [], total: 0, message: 'No cart found for this user.' });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        res.status(200).json({
            success: true,
            items: cart.items,
            total: total
        });
    } catch (err) {
        console.error('Error fetching cart for this Id:', requestedUserId, err);
        next(err);
    }
});

//PUT cart
//uppdaterar kundvagnen med produkt och mängd
cartRouter.put('/', async (req, res, next) => {
	const { prodId, qty, guestId } = req.body;
	const product = await getProduct(prodId);
	console.log('Product fetched:', product);

	//bestäm vilket userid som ska användas - antingen inloggad eller gäst
	let userId;
	if (global.user) {
		userId = global.user.userId; //inloggad användare
	} else {
		//om inte inloggad använda guestid från body eller skapa ett guest-id
		userId = guestId || `guest-${uuid().substring(0, 5)}`;
	}

	//om produkten finns
	if (product) {
		//Uppdatera kundvagnen
		const result = await updateCart(userId, {
			prodId: product.prodId,
			title: product.title,
			price: product.price,
			qty: qty,
		});
		console.log('Result from updateCart:', result);

		//skicka tillbaka lyckat svar med den updaterade kundvagnen
		if (!result) {
			return next({
				status: 400,
				message: 'Cart could not be updated',
			});
		}
	} else {
		next({
			status: 400,
			message: 'Product Id and quantity required',
		});
	}

    // Skicka olika svar beroende på om användare är gäst eller inloggad
	if (!global.user) { //gäst
        return res.status(201).json({
            success: true,
            message: 'Cart updated successfully',
            guestId: userId,
        });
    } else { //inloggad
        return res.status(201).json({
            success: true,
            message: 'Cart updated successfully',
            // cart: result,
        });
    }
});

export default cartRouter;
