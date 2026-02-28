const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Restaurant = Schema(
    {
        restaurantID: String,
        restaurantName: String,
        businessLicense: String,
        foodSafetyCertificate: String,
        openTime: String,
        closeTime: String,
        taxCertificate: String,
        status: String,
        updatedAt: Date,
        createdAt: Date,
        ratings: Number,
        reviewedBy: String,
        reviewedAt: Date,
        visible: Boolean, 
        address: {
            addressLine1: String,
            addressLine2: String,
            postalCode: String,
            state: String,
            country: String,
            phone: String,
            coordinates: []
        }
    }
);

module.exports =  model.Restaurant || mongoose.model("Restaurant", Restaurant);