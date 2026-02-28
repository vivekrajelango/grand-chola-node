const mongoose = require('mongoose');
const UserAuth = require('../models/UserAuth')
const User = require('../models/User')
const v4 = require('uuid')

const uuidv4 = v4;
mongoose.connect('mongodb+srv://feasto_app:yVDQZBgyLDuJuKo4@cluster0.5r1w6.mongodb.net/quickorder-dev?retryWrites=true&w=majority&appName=Cluster0')

const createUserAuth = async (payload) => {
    console.log('payload: ', payload)
    let response = { "data": null, "error": null }
    try {
        let user = await UserAuth.findOne({ "emailID": payload.emailID });
        console.log("user::", user)
        if (user) {
            response.error = "User already exists";
        } else {
            let statusNow = 'active'
            if (payload.role === 'business') {
                statusNow = 'onboarding';
            }
            const userAuth = await UserAuth.create({
                userID: uuidv4.v4(),
                emailID: payload.emailID,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phone: payload.phone,
                password: payload.password,
                role: payload.role,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                status: statusNow
            })
            if (userAuth) {
                response.data = { userID: userAuth.userID, emailID: userAuth.emailID, role: userAuth.role, firstName: userAuth.firstName, lastName: userAuth.lastName, status: userAuth.status }

            } else {
                response.error = "Error while user signup"
            }
        }
    } catch (err) {
        response.error = err;
    }
    return response;
}

const getUserAuth = async (payload) => {
    console.log('payload: ', payload)
    let response = { "data": null, "error": null }
    try {
        const userAuth = await UserAuth.findOne({ "emailID": payload.emailID, "password": payload.password}).select("userID emailID role firstName lastName status");
        console.log(userAuth);

        if (userAuth) {
            response.data = userAuth._doc;
        } else {
            response.error = "User does not exist"
        }
    } catch (err) {
        response.error = err;
    }
    return response;
}

module.exports = { createUserAuth, getUserAuth };