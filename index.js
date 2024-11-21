const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('./db/config');

const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
const jwtKey = 'e-comm';

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    try {
        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        req.body.password = hashedPassword;

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
    } catch (error) {
        resp.status(500).send({ error: "Internal Server Error" });
    }
});


app.post("/login", async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            let user = await User.findOne({ email });

            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    // Remove password from response
                    user = user.toObject();
                    delete user.password;

                    //Generate jwt token
                    jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
                        if (err) {
                            resp.status(500).send({ result: "Something Went Wrong." });
                        } else {
                            resp.send({ user, auth: token });
                        }
                    });
                } else {
                    resp.status(401).send({ result: "Invalid Credentials" });
                }
            } else {
                resp.status(404).send({ result: "No User Found" });
            }
        } else {
            resp.status(400).send({ result: "Email or Password Missing" });
        }
    } catch (error) {
        resp.status(500).send({ error: "Internal Server Error" });
    }
});

app.post("/addProduct", validateToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();

    resp.send(result);
});

app.get("/getProducts", validateToken, async (req, resp) => {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 5 products per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    try {
        // Fetch paginated products
        const products = await Product.find()
            .skip(skip) // Skip the specified number of documents
            .limit(limit); // Limit the number of documents

        // Count the total number of products
        const totalProducts = await Product.countDocuments();

        // Send the paginated response
        if (products.length > 0) {
            resp.json({
                data: products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
            });
        } else {
            resp.json({ result: "No Products Present" });
        }
    } catch (error) {
        resp.status(500).json({ message: "Error fetching products", error: error.message });
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