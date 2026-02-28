const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Review = Schema(
    {
        orderID: String,
        restaurantID: String,
        orderReview: String,
        orderRating: Number,
        userID: String,
        updatedAt: Date,
        createdAt: Date,
        itemsReview: Array
    }
);

module.exports =  model.Order || mongoose.model("Review", Review);