const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return next(new HttpError("Authentication failed!", 401));
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        req.userData = {
            id: decodedToken.id,
            nickname: decodedToken.nickname,
            email: decodedToken.email,
        };

        next();
    } catch (err) {
        return next(new HttpError("Authentication failed!", 401));
    }
};
