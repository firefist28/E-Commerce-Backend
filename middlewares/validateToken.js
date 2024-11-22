const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json('No token, authorization denied');
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_KEY);
            req.user = decode;
            console.log('Decoded user ', req.user);
            next();
        } catch (err) {
            return res.status(400).json('Token not valid');
        }
    } else {
        return res.status(401).json('No token, authorization denied');
    }
};
