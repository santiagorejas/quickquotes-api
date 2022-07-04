const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const generateToken = (id, nickname, email) => {
    let token;

    try {
        token = jwt.sign(
            {
                id,
                nickname,
                email,
            },
            process.env.JWT_KEY
        );
    } catch (err) {
        return new HttpError("Falló la generación de jwt.", 500);
    }
    return token;
};

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

const login = async (req, res, next) => {
    const { nickname, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ nickname });
    } catch (err) {
        return next(new HttpError("Falló la búsqueda de usuario.", 500));
    }

    if (!existingUser) {
        return next(new HttpError("Usuario no encontrado.", 400));
    }

    try {
        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) return next(new HttpError("Incorrect password", 401));
    } catch (err) {
        return next(
            new HttpError("Falló la verificación de la contraseña.", 500)
        );
    }

    const token = generateToken(existingUser.id, nickname, existingUser.email);

    res.json({
        nickname: existingUser.nickname,
        email: existingUser.email,
        id: existingUser._id,
        token,
    });
};

exports.singup = signup;
exports.login = login;
