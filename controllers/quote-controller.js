const Quote = require("../models/quote");

const createQuote = (req, res, next) => {
    const { content } = req.body;

    const { nickname } = req.userData;

    const quote = new Quote({
        content,
        author: nickname,
        date: new Date(),
    });

    res.json(quote);
};

exports.createQuote = createQuote;
