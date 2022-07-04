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

const deleteComment = async (req, res, next) => {
    const { nickname } = req.userData;
    const { cid } = req.params;

    let comment;
    try {
        comment = await Comment.findById(cid);
    } catch (err) {
        return next(new HttpError("Fallo en la búsqueda del comentario.", 500));
    }

    if (!comment) {
        return next(
            new HttpError("El comentario que se desea borrar no existe.", 404)
        );
    }

    if (comment.author !== nickname) {
        return next(
            new HttpError("No podés borrar un comentario que no es tuyo.", 401)
        );
    }

    try {
        await comment.remove();
    } catch (err) {
        return next(
            new HttpError("Ocurrió un error al borrar el comentario.", 500)
        );
    }

    res.json({
        message: "Mensaje borrado correctamente.",
    });
};

exports.createComment = createComment;
exports.deleteComment = deleteComment;
