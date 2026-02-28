const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const UserAuth = require('../models/UserAuth')
const Category = require('../models/Category')
const Menu = require('../models/Menu')
const Order = require('../models/Order')
const GeneralMenu = require('../models/GeneralMenu')
const v4 = require('uuid')
const userService = require('../services/User.services')
var moment = require('moment-timezone');
const readXlsxFile = require('read-excel-file/node')
mongoose.connect('mongodb+srv://feasto_app:yVDQZBgyLDuJuKo4@cluster0.5r1w6.mongodb.net/quickorder-dev?retryWrites=true&w=majority&appName=Cluster0')

const uuidv4 = v4;
const restaurantOnboard = async (businessLicense, foodSafetyCertificate, taxCertificate, restaurantDetails) => {
    let response = { "data": null, "error": null }
    try {
        if (restaurantDetails.userID) {
            const user = await userService.createUser(restaurantDetails);
            const restaurant = await Restaurant.findOneAndUpdate({ restaurantID: restaurantDetails.userID }, {
                $set: {
                    restaurantID: restaurantDetails.userID,
                    restaurantName: restaurantDetails.restaurantName,
                    businessLicense: businessLicense,
                    foodSafetyCertificate: foodSafetyCertificate,
                    openTime: restaurantDetails.openTime,
                    closeTime: restaurantDetails.closeTime,
                    taxCertificate: taxCertificate,
                    status: "awaiting_approval",
                    updatedAt: Date.now(),
                    ratings: 0,
                    address: {
                        addressLine1: restaurantDetails.addressLine1,
                        addressLine2: restaurantDetails.addressLine2,
                        postalCode: restaurantDetails.postalCode,
                        state: restaurantDetails.state,
                        country: restaurantDetails.country,
                        phone: restaurantDetails.phone,
                        coordinates: [restaurantDetails.lat, restaurantDetails.long]
                    }
                }
            },
                { upsert: true, new: true }
            )

            if (user.data && restaurant) {
                await restaurantApprove(restaurantDetails.userID, null, 'awaiting_approval')
                response.data = { "user": user.data, "restaurant": restaurant._doc }
            } else {
                response.error = "Error while onboarding"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }

}

const restaurantApprove = async (userID, approver, review) => {
    let response = { "data": null, "error": null }
    if (review === "approved") {
        review = "awaiting_menu";
    } else if (review === "rejected") {
        review = "rejected"
    }
    try {
        if (userID) {
            const restaurant = await Restaurant.findOneAndUpdate({ restaurantID: userID }, {
                $set: {
                    status: review,
                    updatedAt: Date.now(),
                    ReviewedBy: approver,
                    ReviewedAt: Date.now()
                }
            },
                { upsert: true, new: false }
            )

            const userAuth = await UserAuth.findOneAndUpdate({ userID: userID }, {
                $set: {
                    status: review
                }
            },
                { upsert: true, new: false }
            )

            if (restaurant) {
                response.data = "Status updated successfully"
            } else {
                response.error = "Error while onboarding"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }

}


const createMenuItems = async (userID, menu) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            let menuItems = [];
            for (let item of menu) {
                menuItems.push({
                    restaurantID: userID,
                    itemID: uuidv4.v4(),
                    name: item.name,
                    status: "active",
                    updatedAt: Date.now(),
                    createdAt: Date.now(),
                    quantity: item.quantity,
                    weightValue: item.weightValue,
                    weightUnit: item.weightUnit,
                    description: item.description,
                    shortDescription: item.shortDescription,
                    isVeg: item.isVeg,
                    price: item.price,
                    currencyType: item.currencyType,
                    tax: item.tax
                })
            }
            const items = await Menu.insertMany(menuItems)

            if (items) {
                const restaurantStatus = await restaurantApprove(userID, null, "active");
                response.data = "Items updated successfully"
            } else {
                response.error = "Error while inserting menu items"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }

}

const updateMenuItems = async (userID, menu) => {
    let response = { "data": null, "error": null }
    /*const itemMap = {
        'ID': 'itemID',
        'Name': 'name',
        'Online Price': 'onlinePrice',
        'Dine In Price': 'dineinPrice',
        'Duration': 'duration',
        'Favourite': 'favourite',
        'Type': 'isVeg',
        'Category': "categoryID",
        'Status': 'status',
        'Offer': 'offer',
        'Visible': 'visible',
        'Add Ons': 'addOns',
        'Time Slot 1': 'timeSlot1',
        'Time Slot 2': 'timeSlot2',
        'Time Slot 3': 'timeSlot3'
    }*/
    try {
        if (userID) {
            let menuItems = [];
            await readXlsxFile(Buffer.from(menu)).then(async (rows) => {
                // `rows` is an array of rows
                // each row being an array of cells.
                rows.shift()
                //console.log(rows)
                let itemsList = [];
                for (let row of rows) {
                    let timeSlotTemp = [];
                    let timeSlotsArr = [row[12], row[13], row[14]]
                    for (let tmRow of timeSlotsArr) {
                        if (tmRow !== null) { //12.00 - 14.30
                            let slot = tmRow.split('-'); // ["12.00 "," 14.30"]
                            let slotObj = { low: { hr: 0, min: 0 }, up: { hr: 0, min: 0 } }
                            let low = slot[0].trim().split('.') //["12","00"]
                            let up = slot[1].trim().split('.') //["14","30"]
                            slotObj.low.hr = parseInt(low[0])
                            slotObj.low.min = parseInt(low[1])
                            slotObj.up.hr = parseInt(up[0])
                            slotObj.up.min = parseInt(up[1])
                            timeSlotTemp.push(slotObj)
                        }
                    }

                    let item = {
                        restaurantID: 'test',
                        itemID: row[0],
                        categoryID: row[7],
                        offer: row[9],
                        name: row[1],
                        onlinePrice: row[2],
                        dineinPrice: row[3],
                        shortDescription: row[4],
                        favourite: row[5] === 'Y' ? true : false,
                        isVeg: row[6] === 'V' ? true : false,
                        addOns: row[11] !== null ? (typeof row[11] === 'string' ? row[11].split(',') : [row[11].toString()]) : null,
                        visible: row[10] === 'Y' ? true : false,
                        status: row[8],
                        spicy: row[15] === 'Y' ? true : false,
                        imgSrc: row[16],
                        searchKeys: row[17] !== null ? (typeof row[17] === 'string' ? row[17].split(',') : [row[17].toString()]) : [],
                        timeSlots: timeSlotTemp
                    }
                    itemsList.push(item)
                }

                for (let item of itemsList) {
                    if (item.itemID) {
                        menuItems.push(
                            {
                                updateOne: {
                                    filter: { itemID: item.itemID },
                                    update: {
                                        $set: {
                                            restaurantID: 'test',
                                            name: item.name,
                                            status: item.status,
                                            updatedAt: Date.now(),
                                            isVeg: item.isVeg,
                                            categoryID: item.categoryID,
                                            offer: item.offer,
                                            onlinePrice: item.onlinePrice,
                                            dineinPrice: item.dineinPrice,
                                            shortDescription: item.shortDescription,
                                            favourite: item.favourite,
                                            visible: item.visible,
                                            timeSlots: item.timeSlots,
                                            imgSrc: item.imgSrc,
                                            spicy: item.spicy,
                                            searchKeys: item.searchKeys
                                        }
                                    },
                                    upsert: true
                                }
                            })
                    }
                }
                const items = await Menu.bulkWrite(menuItems)

                const itemsForAddOns = await Menu.find().select("itemID")
                let itemObjMap = new Map();
                itemsForAddOns.map((obj) => {
                    itemObjMap.set(obj.itemID, obj._id)
                })

                let addOnsQuery = []
                for (let item of itemsList) {
                    if (item.addOns != null) {
                        let addOnsTemp = [];
                        for (let rw of item.addOns) {
                            rw = rw.trim()
                            addOnsTemp.push(itemObjMap.get(rw));
                        }
                        addOnsQuery.push({
                            updateOne: {
                                filter: { itemID: item.itemID },
                                update: {
                                    $set: {
                                        updatedAt: Date.now(),
                                        addOns: addOnsTemp
                                    }
                                },
                                upsert: false
                            }
                        })
                    }
                }

                if (addOnsQuery.length > 0) {
                    const addOnsItems = await Menu.bulkWrite(addOnsQuery)
                }

                if (items) {
                    response.data = { "modifiedCount": items.modifiedCount, "unmatchedCount": (itemsList - items.modifiedCount) }
                } else {
                    response.error = "Error while inserting menu items"
                }
            })
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const updateMenuItemsWithoutExcel = async (userID, menu) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            let menuItems = [];
            for (let item of menu) {
                if (item.itemID) {
                    menuItems.push(
                        {
                            updateOne: {
                                filter: { itemID: item.itemID },
                                update: {
                                    $set: {
                                        timeSlots: item.timeSlots,
                                        onlinePrice: item.onlinePrice,
                                        visible: item.visible,
                                        updatedAt: Date.now(),
                                        offer: item.offer,
                                        name: item.name,
                                        status: item.status,
                                        isVeg: item.isVeg,
                                        categoryID: item.categoryID,
                                        dineinPrice: item.dineinPrice,
                                        shortDescription: item.shortDescription,
                                        favourite: item.favourite,
                                        imgSrc: item.imgSrc,
                                        spicy: item.spicy,
                                        searchKeys: item.searchKeys,
                                        customNextVisibleTime: item.customNextVisibleTime
                                    }
                                }
                            }
                        })
                }
            }
            const items = await Menu.bulkWrite(menuItems)

            if (items) {
                response.data = { "modifiedCount": items.modifiedCount, "unmatchedCount": (menu.length - items.modifiedCount) }
            } else {
                response.error = "Error while inserting menu items"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const activateAllItems = async () => {
    let response = { "data": null, "error": null }
    try {
        const menu = await Menu.updateMany({}, {
            $set: {
                "visible": true,
                "updatedAt": Date.now()
            }
        },
            { upsert: false, new: false }
        )

        if (menu) {
            response.data = "Menus were activated successfully! Total: " + menu.modifiedCount
        } else {
            response.error = "Error while activating all menu items"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const activateItemBasedOnTime = async () => {
    let response = { "data": null, "error": null }

    try {
        console.log("inside:::::");
        let currentTime = moment.utc();
        console.log("current time:::: ", currentTime);
        if (currentTime === null) {
            console.log("Current time is set");
        } else {
            console.log(currentTime);
        }
        let currentHours = currentTime.hour();
        let currentMins = currentTime.minutes();
        let currentDate = currentTime.date();
        let currentMonth = currentTime.month();
        let currentYr = currentTime.year();
        console.log(currentTime)
        let menuToBeUpdated = [];

        const menuWithCustomTime = await Menu.find({
            $and: [
                { "customNextVisibleTime": { $exists: true } },
                { "customNextVisibleTime": { $ne: null } }
            ]
        })
            .select("itemID visible customNextVisibleTime");

        if (menuWithCustomTime.length > 0) {
            for (let item of menuWithCustomTime) {
                if (item.customNextVisibleTime.timeStamp !== null && !item.customNextVisibleTime.timeDisplayVal.includes("tomo")) {
                    let ts = item.customNextVisibleTime.timeStamp.getTime() / 1000;
                    ts = moment.unix(ts).utc()
                    let itemHours = ts.hour();
                    let itemMins = ts.minutes();
                    let itemDate = ts.date();
                    let itemMonth = ts.month();
                    let itemYr = ts.year();
                    if (itemDate === currentDate && itemMonth === currentMonth && itemYr === currentYr && ((itemHours === currentHours && itemMins <= currentMins) || (itemHours < currentHours))) {
                        menuToBeUpdated.push(
                            {
                                updateOne: {
                                    filter: { _id: item._id },
                                    update: {
                                        $set: {
                                            visible: true,
                                            customNextVisibleTime: null
                                        }
                                    },
                                    upsert: false
                                }
                            }
                        )
                    }
                }
            }

            if (menuToBeUpdated.length > 0) {
                const updatedMenu = await Menu.bulkWrite(menuToBeUpdated)
                if (updatedMenu) {
                    response.data = "Menus were activated successfully! Total: " + updatedMenu.modifiedCount
                } else {
                    response.error = "Error while activating all menu items"
                }
            } else {
                response.data = "No item found to be updated"
            }
        } else {
            response.data = "No item found to be updated"
        }

        return response;
    } catch (err) {
        console.log("ERROR:::: ", err)
        response.error = err;
        return response;
    }

}

const getAllMenuItems = async (userID) => {
    let response = { "data": null, "error": null }
    console.log("entry: ", new Date())
    try {
        if (userID) {
            const items = await Menu.find({ "restaurantID": "test" }).select("itemID offer name onlinePrice categoryID visible isVeg timeSlots customNextVisibleTime imgSrc addOns spicy searchKeys")
            console.log("api response: ", new Date())
            if (items) {
                response.data = { "menu": items }
            } else {
                response.error = "Error while fetching menu items"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}


const getMenuItems = async (userID) => {
    let response = { "data": null, "error": null }
    console.log("entry: ", new Date())
    try {
        if (userID) {
            const items = await Menu.find({ "restaurantID": "test" }).populate({ path: 'addOns' }).select("itemID categoryID offer name onlinePrice shortDescription favourite imgSrc isVeg addOns timeSlots customNextVisibleTime spicy visible searchKeys")
            console.log("api response: ", new Date())
            if (items) {
                var currentDate = new Date();
                let hr = currentDate.getUTCHours()
                let min = currentDate.getUTCMinutes()
                console.log("current UTC time= ", hr, ":", min)
                if (min >= 30) {
                    min = min + 30 - 60
                    hr = hr + 6
                } else {
                    hr = hr + 5;
                    min = min + 30
                }
                if (hr === 24) {
                    hr = 0
                } else if (hr > 23) {
                    hr = hr - 24
                }

                console.log("current IST time= ", hr, ":", min)
                const groupedItems = Object.entries(
                    items.reduce((item, { itemID, categoryID, offer, name, onlinePrice, shortDescription, favourite, imgSrc, isVeg, addOns, spicy, timeSlots, customNextVisibleTime, visible, searchKeys }) => {
                        if (visible) {
                            visible = false;
                            if (timeSlots && timeSlots.length > 0) {
                                for (let slot of timeSlots) {
                                    if ((hr === slot.low.hr && min >= slot.low.min) || hr > slot.low.hr) {
                                        if ((hr < slot.up.hr) || (hr === slot.up.hr && min <= slot.up.min)) {
                                            visible = true;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                visible = true;
                            }
                        }
                        if (!item[categoryID]) {
                            item[categoryID] = [];
                        }
                        item[categoryID].push({ itemID, categoryID, offer, name, onlinePrice, shortDescription, favourite, imgSrc, isVeg, addOns, timeSlots, customNextVisibleTime, spicy, visible, searchKeys });

                        return item;
                    }, {})
                ).map(([id, MenuItems]) => ({ id, MenuItems }));
                console.log("grouping: ", new Date())
                const offerItems = Object.entries(
                    items.reduce((item, { itemID, categoryID, offer, name, onlinePrice, shortDescription, favourite, imgSrc, isVeg, addOns, timeSlots, customNextVisibleTime, spicy, visible, searchKeys }) => {
                        if (offer) {
                            if (visible) {
                                visible = false;
                                if (timeSlots && timeSlots.length > 0) {
                                    for (let slot of timeSlots) {
                                        if ((hr === slot.low.hr && min >= slot.low.min) || hr > slot.low.hr) {
                                            if ((hr < slot.up.hr) || (hr === slot.up.hr && min <= slot.up.min)) {
                                                visible = true;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    visible = true;
                                }
                            }
                            if (offer && offer !== '0') {
                                item[offer] = [];
                                item[offer].push({ itemID, categoryID, offer, name, onlinePrice, shortDescription, favourite, imgSrc, isVeg, addOns, spicy, visible, searchKeys });
                            }

                        }
                        return item;
                    }, {})
                ).map(([offer, MenuItems]) => ({ offer, MenuItems }));
                console.log("offers grouping: ", new Date())
                for (let row of groupedItems) {
                    let category = await Category.find({ "categoryID": row.id, "restaurantID": "test" })
                    if (category[0]) {
                        row.title = category[0]._doc.title;
                        row.content = category[0]._doc.content;
                        row.imgSrc = category[0]._doc.imgSrc;
                    }
                }
                console.log("adding category: ", new Date())
                response.data = { "menu": groupedItems, "offers": offerItems }
            } else {
                response.error = "Error while fetching menu items"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const getCategories = async (userID) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            let category = await Category.find({ "restaurantID": "test" })

            if (category) {
                response.data = { "categories": category }
            } else {
                response.error = "Error while fetching menu items"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const restaurantStatus = async (userID, visible) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            const restaurant = await Restaurant.findOneAndUpdate({ restaurantID: "test" }, {
                $set: {
                    visible: visible,
                    updatedAt: Date.now()
                }
            },
                { upsert: false, new: false }
            )

            if (restaurant) {
                response.data = { "visible": visible }
            } else {
                response.error = "Error while onboarding"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }

}

const getRestaurantStatus = async (userID) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            let restaurant = await Restaurant.find({ "restaurantID": "test" }).select("restaurantID restaurantName visible")

            if (restaurant) {
                response.data = { "restaurant": restaurant }
            } else {
                response.error = "Error while fetching restaurant"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

const getPredefinedItems = async () => {
    let response = { "data": null, "error": null }
    try {
        const items = await GeneralMenu.find()

        if (items) {
            response.data = items
        } else {
            response.error = "Error while fetching menu items"
        }

        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }

}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

const createOrder = async (userID, order) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            order.restaurantID = 'test';
            order.createdAt = Date.now();
            const order1 = await Order.create(order);

            if (order1) {
                await sleep(1500)
                let orderFound = await Order.find({ "_id": order1._id })
                if (orderFound) {
                    response.data = { orderID: orderFound[0].orderID }
                }
            } else {
                response.error = "Error while inserting order"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }
}

const updateOrderStatus = async (userID, orderID, status) => {
    let response = { "data": null, "error": null }
    try {
        if (userID) {
            if (typeof orderID === 'string') {
                orderID = parseInt(orderID)
            }
            const order = await Order.findOneAndUpdate({ "orderID": orderID }, {
                $set: {
                    "status": status,
                    "updatedAt": Date.now()
                }
            },
                { upsert: false, new: false }
            )

            if (order) {
                response.data = "Order status updated successfully!"
            } else {
                response.error = "Error while updating order status"
            }
        } else {
            response.error = "User does not exist"
        }
        return response;
    } catch (err) {
        response.error = err;
        return response;
    }
}

const getOrder = async (userID, orderID) => {
    let response = { "data": null, "error": null }
    try {

        if (userID) {
            let order = await Order.find({ "orderID": parseInt(orderID) })
            if (order.length == 0) {
                response.error = "Order not found"
            }
            else if (order.length == 1) {
                response.data = { "order": order[0] }
            } else if (order.length > 1) {
                response.error = "Multiple orders with same ID"
            } else {
                response.error = "Error while fetching order"
            }
        } else {
            response.error = "User does not exist"
        }

        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }
}

const getAllOrder = async (userID) => {
    let response = { "data": null, "error": null }
    try {

        if (userID) {
            let orders = await Order.find()

            if (orders) {
                response.data = { "orders": orders }
            } else {
                response.error = "Error while fetching orders"
            }
        } else {
            response.error = "User does not exist"
        }

        return response;
    } catch (err) {
        response.error = err.message;
        return response;
    }
}

module.exports = { restaurantOnboard, restaurantApprove, restaurantStatus, createMenuItems, updateMenuItems, getMenuItems, getAllMenuItems, getPredefinedItems, getCategories, updateMenuItemsWithoutExcel, getRestaurantStatus, createOrder, getAllOrder, getOrder, updateOrderStatus, activateAllItems, activateItemBasedOnTime };