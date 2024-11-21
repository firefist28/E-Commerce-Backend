const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, resp) => {
    try {
        const { name, email, password } = req.body;
        if (name && email && password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;

            let user = new User(req.body);
            user = await user.save();
            user = user.toObject();
            delete user.password;

            const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '2h' });
            resp.json({ user, auth: token });
        } else {
            resp.status(400).send({ error: "Bad Request" });
        }
    } catch (error) {
        resp.status(500).send({ error: "Internal Server Error" });
    }
};

exports.login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) return resp.status(404).send({ result: "No User Found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            user = user.toObject();
            delete user.password;

            const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '2h' });
            resp.json({ user, auth: token });
        }
        if (!isPasswordValid) return resp.status(401).send({ result: "Invalid Credentials" });
    } catch (error) {
        resp.status(500).send({ error: "Internal Server Error " + error });
    }
};
