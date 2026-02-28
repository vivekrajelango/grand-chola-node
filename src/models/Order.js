const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Order = Schema(
    {
        orderID: Number,
        restaurantID: String,
        name: String,
        mobile: String,
        options: String,
        address: String,
        price: String,
        updatedAt: Date,
        createdAt: Date,
        orderDetails: Array,
        instructions: String,
        status: String
    }
);

module.exports =  model.Order || mongoose.model("Order", Order);