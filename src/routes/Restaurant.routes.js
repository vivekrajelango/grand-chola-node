const express = require('express');
const router = express.Router();
const {restaurantOnboard, restaurantApprove, restaurantStatus, createMenuItems, updateMenuItems, getAllMenuItems, getMenuItems, getPredefinedItems, getCategories, getRestaurantStatus, updateMenuItemsWithoutExcel, createOrder, getAllOrder, getOrder, updateOrderStatus} = require('../controllers/Restaurant.controller');

router.route('/onboard').post(restaurantOnboard)
router.route('/update-status').post(restaurantApprove)
router.route('/create-menu').post(createMenuItems)
router.route('/fetch-predefined-menu').get(getPredefinedItems)


router.route('/fetch-menu').get(getMenuItems)
router.route('/fetch-admin-menu').get(getAllMenuItems)
router.route('/update-menu').post(updateMenuItems)
router.route('/update-items').post(updateMenuItemsWithoutExcel)
router.route('/fetch-categories').get(getCategories)
router.route('/update-visibility').post(restaurantStatus)
router.route('/fetch-restaurant-visibility').get(getRestaurantStatus)
router.route('/create-order').post(createOrder)
router.route('/fetch-all-order').get(getAllOrder)
router.route('/fetch-order').get(getOrder)
router.route('/update-order-status').post(updateOrderStatus)

module.exports = router;