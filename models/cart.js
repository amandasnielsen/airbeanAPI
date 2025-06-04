import mongoose from "mongoose"

//skapar en referens till mongoose.schema 
const Schema = mongoose.Schema;

// definierar ett schema för enskild produkt i cart(cartitem)
const cartItemSchema = new Schema ({
    prodId: String,
    title: String,
    price: Number,
    qty: Number
})

//definierar schema för kundvagnen
const cartSchema = new Schema ({
    userId : {
        type: String,
        required: true,
        default: null
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema)

export default Cart;