const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return resp.status(403).send({ result: 'Authentication Failed' });

    jwt.verify(token, process.env.JWT_KEY, (err, valid) => {
        if (err) return resp.status(401).send({ result: 'Unauthorized' });
        next();
    });
};
