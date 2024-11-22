//file used for testing purpose for RBAC (Role Based Access Control)

const express = require('express');
const verifyToken = require('../middlewares/validateToken');
const authorizeRoles = require('../middlewares/validateRole');
const router = express.Router();

//Only admin
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' })
});

//All can access
router.get('/user', verifyToken, authorizeRoles('user'), (req, res) => {
    res.json({ message: 'Welcome User' })
});

module.exports = router;