const express = require("express");
const cors = require('cors')
const app = express();
const cron = require("node-cron");
const restaurantServices = require("../surprisebox-backend-app/src/services/Restaurant.services")

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
const multer = require('multer')

//const upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.xlsx') //Appending .jpg
    }
})

var upload = multer({ storage: storage });

app.use('/api/auth', require('./src/routes/Auth.routes'))
app.use('/api/user', require('./src/routes/User.routes'))
app.use('/api/restaurant', upload.single('restaurant_worksheet'), require('./src/routes/Restaurant.routes'))

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

app.get("/", (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

//Cron Job to automatically activate item everyday at 4 AM

cron.schedule("0 0 4 * * *", async function() {
    let response = await restaurantServices.activateAllItems();
    console.log(response)
}, {
    scheduled:true,
    timezone: "Asia/Kolkata"
})

//cron to run every min to check and activate the menu items based on custom activation time
cron.schedule("0 * * * * *", async function() {
    let response = await restaurantServices.activateItemBasedOnTime();
    console.log(response)
}, {
    scheduled:true,
    timezone: "Asia/Kolkata"
})
