const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const blackListToken = require('../models/blackListToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split[' '][1];
    if (!token) return res.status(401).json({ message: 'Unauthorized Token' });

    const isBlackListed = await blackListToken.findOne({token: token
    });
    if (isBlackListed) return res.status(401).json({ message: 'Unauthorized Token'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split[' '][1];
    if (!token) return res.status(401).json({ message: 'Unauthorized Token' });

    const isBlackListed = await BlackListToken.findOne({token: token
    });
    if (isBlackListed) return res.status(401).json({ message: 'Unauthorized Token'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded.id);
        if (!captain) return res.status(401).json({ message: 'Unauthorized' });
        req.captain = captain;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}