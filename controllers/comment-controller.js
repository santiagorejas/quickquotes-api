const HttpError = require("../models/http-error");
const Comment = require("../models/comment");
const Quote = require("../models/quote");

const createComment = async (req, res, next) => {
    const { content, quoteId } = req.body;
    const { nickname } = req.userData;

    let quote;
    try {
        quote = await Quote.findById(quoteId);
    } catch (err) {
        return next(new HttpError("Falló la búsqueda del quote.", 500));
    }

    if (!quote) {
        return next(
            new HttpError("No existe el quote que se dea comentar.", 404)
        );
    }

    const comment = new Comment({
        content,
        quote: quoteId,
        author: nickname,
        date: new Date(),
    });

    try {
        await comment.save();
    } catch (err) {
        return next(new HttpError("Falló el guardado del comentario.", 500));
    }

    res.json({ comment });
};

exports.createComment = createComment;
