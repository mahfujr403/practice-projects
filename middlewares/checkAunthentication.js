const jwt = require('jsonwebtoken');

const checkAuthentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        next(401);
        console.log(error);
    }
};

module.exports = checkAuthentication;
