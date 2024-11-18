const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('./db/config');

const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
const jwtKey = 'e-comm';

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let userBody = new User(req.body);
    let user = await userBody.save();

    user = user.toObject();
    delete user.password;

    jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
        if (err) {
            resp.send({ user: "Something Went Wrong." });
        }
        resp.send({ user, auth: token });
    });
});


app.post("/login", async (req, resp) => {
    //To remove password from response body

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    resp.send({ result: "Something Went Wrong." });
                }
                resp.send({ user, auth: token });
            });

        } else {
            resp.send({ result: "No User Found" });
        }
    } else {
        resp.send({ result: "Username or Password Not Found" });
    }

});

app.post("/addProduct", validateToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();

    resp.send(result);
});

app.get("/getProducts", validateToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products Present" });
    }
});

app.delete("/product/:id", validateToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});

app.get("/product/:id", validateToken, async (req, resp) => {
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

app.put('/updateProduct/:id', validateToken, async (req, resp) => {
    try {
        let result = await Product.updateOne(
            { _id: req.params.id }, {
            $set: req.body
        })
        resp.send(result);
    } catch (error) {
        resp.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

app.get("/search/:key", validateToken, async (req, resp) => {
    try {
        let result = await Product.find({
            "$or": [
                { name: { $regex: req.params.key, $options: 'i' } }, //Case-insensitive
                { company: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } }
            ]
        });
        resp.send(result);
    } catch (error) {
        resp.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

function validateToken(req, resp, next) {
    let token = req.headers['authorization'];

    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: 'Unauthorized' });
            } else {
                next();
            }
        })
    } else {
        resp.status(403).send({ result: 'Authentication Failed' });
    }
}

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