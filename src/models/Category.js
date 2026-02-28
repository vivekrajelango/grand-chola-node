const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Category = Schema(
    {
        restaurantID: String,
        categoryID: String,
        title: String,
        content: String,
        imgSrc: String,
        status: String,
        updatedAt: Date,
        createdAt: Date
    }
);

module.exports = model.Category || mongoose.model("categories", Category);