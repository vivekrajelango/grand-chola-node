const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SurpriseBox = Schema(
    {
        restaurantID: String,
        boxID: String,
        name: String,
        status: String,
        updatedAt: Date,
        createdAt: Date,
        ratings: Number,
        quantity: Number,
        unit: String,
        description: String,
        shortDescription: String,
        type: String,
        price: Number,
        currencyType: String,
        tax: Number,
        ismorningSlot: Boolean,
        morningQty: Number,
        isafternoonSlot: Boolean,
        afternoonQty: Number,
        isNightSlot: Boolean,
        nightQty: Number
    }
);

module.exports =  model.SurpriseBox || mongoose.model("SurpriseBox", SurpriseBox);