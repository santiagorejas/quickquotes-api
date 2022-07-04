const HttpError = require("../models/http-error");
const Quote = require("../models/quote");

const QUOTES_PER_PAGE = 12;

const createQuote = async (req, res, next) => {
    const { content } = req.body;

    const { nickname } = req.userData;

    const quote = new Quote({
        content,
        author: nickname,
        date: new Date(),
    });

    try {
        await quote.save();
    } catch (err) {
        return next(new HttpError("Falló el almacenamiento de la quote.", 500));
    }

    res.json(quote);
};

const getQuotes = async (req, res, next) => {
    let { page } = req.query;

    if (!page) {
        page = 1;
    }

    let totalItems = 0;
    let quotes = [];
    try {
        totalItems = await Quote.find().count();
        quotes = await Quote.find()
            .sort({ date: -1 })
            .skip((page - 1) * QUOTES_PER_PAGE)
            .limit(QUOTES_PER_PAGE);
    } catch (err) {
        return next(new HttpError("Falló la búsqueda de quotes.", 500));
    }

    res.json({ quotes, totalPages: Math.ceil(totalItems / QUOTES_PER_PAGE) });
};

exports.createQuote = createQuote;
exports.getQuotes = getQuotes;
