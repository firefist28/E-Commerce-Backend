const express = require('express');
const cors = require('cors');

require('./db/config');

const User = require("./db/User");
const Product = require("./db/Product");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();

    result = result.toObject();
    delete result.password;

    resp.send(result);
});


app.post("/login", async (req, resp) => {
    //To remove password from response body

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: "No User Found" });
        }
    } else {
        resp.send({ result: "Username or Password Not Found" });
    }

});

app.post("/addProduct", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();

    resp.send(result);
});

app.get("/getProducts", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products Present" });
    }
});

app.delete("/product/:id", async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});

app.get("/product/:id", async (req, resp) => {
    try {
        let result = await Product.findOne({ _id: req.params.id });
        if (result) {
            resp.send(result);
        } else {
            resp.send({ result: "No Product Found" });
        }
    } catch (error) {
        resp.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});


//const mongoose = require('mongoose');

//const connectDB = async () => {
//    mongoose.connect('mongodb://localhost:27017/e-comm');
//    const productSchema = new mongoose.Schema({});
//    const product = mongoose.model('product', productSchema);
//    const data = await product.find();
//    console.warn(data);
//}

//connectDB();



//app.get("/", (req, resp) => {
//    resp.send("app is working....");
//})

app.listen(5000)