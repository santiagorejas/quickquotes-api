const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Quote = require("../models/quote");
const Comment = require("../models/comment");
const Like = require("../models/like");

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

const getQuoteDetail = async (req, res, next) => {
  const { qid } = req.params;

  let quote;

  try {
    quote = await Quote.findById(qid);
  } catch (err) {
    return next(new HttpError("Falló la búsqueda del quote.", 500));
  }

  if (!quote) {
    return next(new HttpError("El id del quote no es válido.", 404));
  }

  let comments;
  try {
    comments = await Comment.find({ quote: qid }).select("author content date");
  } catch (err) {
    return next(new HttpError("Falló la búsqueda de comentarios del quote."));
  }

  res.json({
    quote,
    comments,
  });
};

const updateQuote = async (req, res, next) => {
  const { qid } = req.params;
  const { nickname } = req.userData;
  const { content } = req.body;

  let quote;
  try {
    quote = await Quote.findById(qid);
  } catch (err) {
    return next(new HttpError("Falló la búsqueda del quote.", 500));
  }

  if (!quote) {
    return next(
      new HttpError("El quote que se quiere modificar no existe.", 404)
    );
  }

  if (quote.author != nickname) {
    return next(new HttpError("No podés modificar un quote no creaste.", 401));
  }

  try {
    quote.content = content;
    await quote.save();
  } catch (err) {
    return next(
      new HttpError("Ocurrió un error en la modificación del quote.", 500)
    );
  }

  res.json({
    message: "Quote modificado correctamente.",
  });
};

const deleteQuote = async (req, res, next) => {
  const { nickname } = req.userData;
  const { qid } = req.params;

  let quote;
  try {
    quote = await Quote.findById(qid);
  } catch (err) {
    return next(new HttpError("Error en la búsqueda del quote.", 500));
  }

  if (!quote) {
    return next(new HttpError("El quote que se desea borrar no existe.", 404));
  }

  if (quote.author != nickname) {
    return next(
      new HttpError("No podés borrar un quote que no sea tuyo.", 401)
    );
  }

  try {
    await quote.remove();
  } catch (err) {
    return next(new HttpError("Falló el borrado del quote.", 500));
  }

  res.json({
    message: "Quote borrado correctamente!",
  });
};

const getQuotesByUserNickname = async (req, res, next) => {
  let { page } = req.query;

  if (!page) {
    page = 1;
  }

  const { nickname } = req.params;

  let totalItems = 0;
  let quotes = [];
  try {
    totalItems = await Quote.find({ author: nickname }).count();
    quotes = await Quote.find({ author: nickname })
      .sort({ date: -1 })
      .skip((page - 1) * QUOTES_PER_PAGE)
      .limit(QUOTES_PER_PAGE);
  } catch (err) {
    return next(new HttpError("Fetching quotes failed.", 500));
  }

  res.json({ quotes, totalPages: Math.ceil(totalItems / QUOTES_PER_PAGE) });
};

const getLikedQuotes = async (req, res, next) => {
  let { page } = req.query;

  if (!page) {
    page = 1;
  }

  const { nickname } = req.userData;

  let quotesId = [];
  try {
    quotesId = await Like.find({ user: nickname }).select("quote");
  } catch (err) {
    return next(new HttpError("Fetching likes failed.", 500));
  }

  quotesId = quotesId.map((data) => data.quote);

  let totalItems = 0;
  let quotes = [];
  try {
    totalItems = await Quote.find({ _id: { $in: quotesId } }).count();
    quotes = await Quote.find({ _id: { $in: quotesId } })
      .sort({ date: -1 })
      .skip((page - 1) * QUOTES_PER_PAGE)
      .limit(QUOTES_PER_PAGE);
  } catch (err) {
    return next(new HttpError("Fetching quotes failed.", 500));
  }

  res.json({ quotes, totalPages: Math.ceil(totalItems / QUOTES_PER_PAGE) });
};

const getLikedQuotesId = async (req, res, next) => {
  const { nickname } = req.userData;

  let quotes = [];
  try {
    quotes = await Like.find({ user: nickname }).select("quote");
  } catch (err) {
    return next(new HttpError("Fetching likes quotes id failed.", 500));
  }

  quotes = quotes.map((q) => q.quote);

  res.json({ quotes });
};

exports.createQuote = createQuote;
exports.getQuotes = getQuotes;
exports.getQuoteDetail = getQuoteDetail;
exports.updateQuote = updateQuote;
exports.deleteQuote = deleteQuote;
exports.getQuotesByUserNickname = getQuotesByUserNickname;
exports.getLikedQuotes = getLikedQuotes;
exports.getLikedQuotesId = getLikedQuotesId;
