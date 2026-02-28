const authServices = require('../services/Auth.services')

const login = async (req, res) => {
	let payload = req.body;
	//let api_key = req.header("x-api-key");
	try {
		console.log("authcontroller entry")
		let result = await authServices.getUserAuth(payload)
		console.log("maincontroller - after response")
		if (result) {
			if (result.data != null) {
				res.status(200).send(result);
			} else {
				res.status(500).send(result);
			}
		} else {
			res.status(500).send({ "data": null, "error": "Error while signup" });
		}

	} catch (err) {
		res.status(500).send({ "data": null, "error": err.message });
	}

};

const register = async (req, res) => {
	let payload = req.body;
	//let api_key = req.header("x-api-key");
	try {
		console.log("authcontroller entry")
		let result = await authServices.createUserAuth(payload)
		console.log("maincontroller - after response")
		if (result) {
			if (result.data != null) {
				res.status(200).send(result);
			} else {
				res.status(500).send(result);
			}
		} else {
			res.status(500).send({ "data": null, "error": "Error while signup" });
		}

	} catch (err) {
		res.status(500).send({ "data": null, "error": err.message });
	}

};

module.exports = { login, register };