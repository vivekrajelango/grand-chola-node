const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserAuthSchema = new Schema(
  {
    userID: String,
    emailID: String,
    firstName: String,
    lastName: String,
    phone: String,
    password: String,
    role: String,
    createdAt: Date,
    updatedAt: Date,
    status: String
  }
);

const UserAuth = model('UserAuth', UserAuthSchema);
module.exports = UserAuth;