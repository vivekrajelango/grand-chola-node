const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GeneralMenu = Schema(
    {
        name: String,
        status: String,
        quantity: Number,
        weightValue: Number,
        weightUnit: String,
        description: String,
        shortDescription: String,
        isVeg: Boolean,
        price: Number,
        currencyType: String,
        tax: Number,
        image: String
    }
);

module.exports = model.GeneralMenu || mongoose.model("GeneralMenu", GeneralMenu);