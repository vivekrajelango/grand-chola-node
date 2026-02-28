const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    userID: String,
    firstName:String,
    lastName:String,
    dateOfBirth:Date,
    gender: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
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

const User = model('User', UserSchema);
module.exports =  User;