import Cart from '../models/cart.js';
import MenuItem from "../models/menuItem.js"

export async function getProduct(prodId) {
    try {
        const product = await MenuItem.findOne({ prodId : prodId });
        return product;
    } catch (error) {
        console.log("Error getting product", error.message);
        return null;
    }
}

//hämtar eller skapar en kundvagn för en användare eller gäst
export async function getOrCreateCart(userId) {
	try {
        //försöker hitta kundvagn i databasen som är cartId = userId
		let cart = await Cart.findOne({ userId: userId });

        //om ingen cart hittades  så skapas en tom array
		if (!cart) {
			cart = await Cart.create({
				userId: userId,
				items: [],
			});
		}
		return cart;
	} catch (error) {
        console.log(error.message)
        return null;
    }
}

//Uppdaterar innehållet i en kundvagn för en given användare eller gäst.
export async function updateCart(userId, product) {
    try {
        // 1. Hämta eller skapa en kundvagn via getOrCreateCart
        const cart = await getOrCreateCart(userId)


        if(!cart){
            throw new Error('Could not find cart')
        }
        //Söker efter om produkten redan finns i cartens items-lista
        const item = cart.items.find(i => i.prodId === product.prodId)

        if(item) {
            // om de finns uppdatera bara qty
            item.qty = product.qty
        } else {
            // om den inte finns lägg till hela produkten
            cart.items.push(product)
        }

        // om qty sänks till 0 så ta bort
        if(product.qty === 0) {
            console.log('raderar item')
            cart.items = cart.items.filter(i => i.prodId !== product.prodId)
        }

        //spara ändringarna
        await cart.save()
        return cart
    } catch (error) {
        console.log(error.message);
        return null
    }
}
