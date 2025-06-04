import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const menuItemSchema = new Schema ({
    prodId : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    }
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema, 'menu');

export default MenuItem;