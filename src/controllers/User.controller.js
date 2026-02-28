const userService = require("../services/User.services")

const createUser = async (req, res) => {
    try {
        let result = await userService.createUser(req.body)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while user creation" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

module.exports = { createUser };