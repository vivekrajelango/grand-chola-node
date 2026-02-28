const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Menu = Schema(
    {
        restaurantID: String,
        itemID: String,
        categoryID: String,
        offer: String,
        name: String,
        onlinePrice: String,
        dineinPrice: String,
        duration: String,
        favourite: Boolean,
        imgSrc: String,
        isVeg: Boolean,
        addOns: [{type: Schema.ObjectId, ref: 'Menu'}],
        visible: Boolean,
        status: String,
        timeSlots: Array,
        updatedAt: Date,
        createdAt: Date,
        ratings: Number,
        quantity: Number,
        weightValue: Number,
        weightUnit: String,
        description: String,
        shortDescription: String,
        spicy: Boolean,
        searchKeys: Array,
        customNextVisibleTime: {
            timeStamp: Date,
            timeDisplayVal: String
        }
    }
);

module.exports = model.Menu || mongoose.model("Menu", Menu);