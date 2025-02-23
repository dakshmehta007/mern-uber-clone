const models = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split[' '][1];
    if (!token) return res.status(401).json({ message: 'Unauthorized Token' });

    const isBlackListed = await models.BlackListToken.findOne({token: token
    });
    if (isBlackListed) return res.status(401).json({ message: 'Unauthorized Token'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await models.User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}