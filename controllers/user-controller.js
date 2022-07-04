const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
    const { nickname, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ nickname });
    } catch (err) {
        return next(new HttpError("Problema al buscar al usuario.", 500));
    }

    if (existingUser) {
        return next(new HttpError("El nickname ya está utilizado.", 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError("Falló el hashing de la contraseña.", 500));
    }

    const user = new User({
        nickname,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
    } catch (err) {
        return next(new HttpError("Falló la creación de usuario.", 500));
    }

    res.json({
        nickname: user.nickname,
        email: user.email,
    });
};

exports.singup = signup;
