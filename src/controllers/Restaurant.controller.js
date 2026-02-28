const fs = require("fs");
const restaurantServices = require("../services/Restaurant.services")

const restaurantOnboard = async (req, res) => {
    //fetch the images
    let businessLicense = null;
    let foodSafetyCertificate = null;
    let taxCertificate = null;
    let restaurantDetails = req.body;
    try {
        if (req.files) {
            if (req.files.business_license) {
                let businessLicensePath = req.files.business_license[0].path;
                businessLicense = fs.readFileSync(businessLicensePath, { encoding: 'base64' });
                fs.unlinkSync(businessLicensePath);
            }
            if (req.files.food_safety_certificate) {
                let foodSafetyCertificatePath = req.files.food_safety_certificate[0].path;
                foodSafetyCertificate = fs.readFileSync(foodSafetyCertificatePath, { encoding: 'base64' });
                fs.unlinkSync(foodSafetyCertificatePath);
            }
            if (req.files.tax_certificate) {
                let taxCertificatePath = req.files.tax_certificate[0].path
                taxCertificate = fs.readFileSync(taxCertificatePath, { encoding: 'base64' });
                fs.unlinkSync(taxCertificatePath);
            }
        }
        let result = await restaurantServices.restaurantOnboard(businessLicense, foodSafetyCertificate, taxCertificate, restaurantDetails)

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
}

const restaurantApprove = async (req, res) => {
    try {
        let result = await restaurantServices.restaurantApprove(req.body.userID, req.body.approver, req.body.review)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while updating status" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const createMenuItems = async (req, res) => {
    try {
        let result = await restaurantServices.createMenuItems(req.body.userID, req.body.menuItems)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while updating status" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getPredefinedItems = async (req, res) => {
    try {
        let result = await restaurantServices.getPredefinedItems()

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching menu items" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}



//APIs VALID FOR THIS PROJECT
const updateMenuItems = async (req, res) => {
    try {

        if (req.file) {
            let restaurantWorksheet = req.file.path;
            let menuFile = fs.readFileSync(restaurantWorksheet);
            fs.unlinkSync(restaurantWorksheet);

            let result = await restaurantServices.updateMenuItems(req.headers.host, menuFile)

            if (result) {
                if (result.data != null) {
                    res.status(200).send(result);
                } else {
                    res.status(500).send(result);
                }
            } else {
                res.status(500).send({ "data": null, "error": "Error while updating menu items" });
            }

        } else {
            res.status(500).send({ "data": null, "error": "Error while updating menu items" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const updateMenuItemsWithoutExcel = async (req, res) => {
    try {
        let result = await restaurantServices.updateMenuItemsWithoutExcel(req.headers.host, req.body.menuItems)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while updating menu items" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getAllMenuItems = async (req, res) => {
    try {
        let result = await restaurantServices.getAllMenuItems(req.headers.host)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching menu items" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}
const getMenuItems = async (req, res) => {
    try {
        let result = await restaurantServices.getMenuItems(req.headers.host)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching menu items" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getCategories = async (req, res) => {
    try {
        let result = await restaurantServices.getCategories(req.headers.host)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching getCategories" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const restaurantStatus = async (req, res) => {
    try {
        let result = await restaurantServices.restaurantStatus(req.headers.host, req.body.visible)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while updating status" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getRestaurantStatus = async (req, res) => {
    try {
        let result = await restaurantServices.getRestaurantStatus(req.headers.host)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while getting status" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const createOrder = async (req, res) => {
    try {
        let result = await restaurantServices.createOrder(req.headers.host, req.body.order)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while creating order" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        let result = await restaurantServices.updateOrderStatus(req.headers.host, req.body.orderID, req.body.status)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while creating order" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getOrder = async (req, res) => {
    try {
        let result = await restaurantServices.getOrder(req.headers.host, req.query.orderID)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching order" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

const getAllOrder = async (req, res) => {
    try {
        let result = await restaurantServices.getAllOrder(req.headers.host)

        if (result) {
            if (result.data != null) {
                res.status(200).send(result);
            } else {
                res.status(500).send(result);
            }
        } else {
            res.status(500).send({ "data": null, "error": "Error while fetching all orders" });
        }

    } catch (err) {
        res.status(500).send({ "data": null, "error": err.message });
    }
}

module.exports = { restaurantOnboard, restaurantApprove, restaurantStatus, createMenuItems, updateMenuItems, getMenuItems, getAllMenuItems, getPredefinedItems, getCategories, getRestaurantStatus, updateMenuItemsWithoutExcel, createOrder, getOrder, getAllOrder, updateOrderStatus };
