




const express = require('express');
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();
const connectToDatabase = require("./Configs/db");

// const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const AdminRouter = require("./Routers/Admin.route");
const UserRouter = require("./Routers/User.route");
const ProductRouter = require("./Routers/Product,route");

const app = express();
const port = process.env.PORT || 2023;
const http = require('http');
const server = http.createServer(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use(fileUpload({useTempFiles: true}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

app.use("/E-Commerce/Admin" , AdminRouter);
app.use("/E-Commerce/User" , UserRouter);
app.use("/E-Commerce/Product", ProductRouter);

server.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Server running on port No. ${port}`);
        console.log(`for using the localhost please use the url - localhost:${port}/`)
    } catch (err) {
        console.log({ message: "Failed to connect Database", err });
    }
});