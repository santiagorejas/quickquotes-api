const HttpError = require("../models/http-error");
const Like = require("../models/like");

const likeQuote = async (req, res, next) => {
    const { like } = req.body;
    const { nickname } = req.userData;
    const { qid } = req.params;

    if (!like) {
        try {
            await Like.deleteOne({ user: nickname, quote: qid });
        } catch (err) {
            return next(new HttpError("Falló el borrado del like.", 500));
        }

        return res.json({
            message: "Like borrado correctamente.",
        });
    }

    try {
        const likeExist = await Like.exists({ user: nickname, quote: qid });
        if (likeExist) {
            return next(new HttpError("El like ya está registrado.", 400));
        }
    } catch (err) {
        return next(new HttpError("Falló la búsqueda del like.", 500));
    }

    const newLike = new Like({
        user: nickname,
        quote: qid,
    });

    try {
        await newLike.save();
    } catch (err) {
        return next(new HttpError("Falló el almacenamiento del like.", 500));
    }

    res.json({ message: "like guardado correctamente!" });
};

exports.likeQuote = likeQuote;
