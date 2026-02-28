const mongoose = require('mongoose');
const User = require('../models/User')
const v4 = require('uuid')
mongoose.connect('mongodb+srv://feasto_app:yVDQZBgyLDuJuKo4@cluster0.5r1w6.mongodb.net/quickorder-dev?retryWrites=true&w=majority&appName=Cluster0')

const createUser = async (userDetails) => {
    let response = { "data": null, "error": null }
    if (userDetails.userID) {
        try {
            const user = await User.findOneAndUpdate({ userID: userDetails.userID }, {
                $set: {
                    userID: userDetails.userID,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    dateOfBirth: new Date(userDetails.dateOfBirth),
                    gender: userDetails.gender,
                    status: "active",
                    updatedAt: Date.now(),
                    address: {
                        addressLine1: userDetails.addressLine1,
                        addressLine2: userDetails.addressLine2,
                        postalCode: userDetails.postalCode,
                        state: userDetails.state,
                        country: userDetails.country,
                        phone: userDetails.phone,
                        coordinates: [userDetails.lat, userDetails.long]
                    }
                }
            },
                { upsert: true, new: true }
            )


            if (user) {
                response.data = user._doc
            } else {
                response.error = "Error while creating user"
            }
            return response;
        } catch (err) {
            response.error = err;
            return response;
        }
    } else {
        response.error = "User does not exist"
    }
}

module.exports = { createUser };