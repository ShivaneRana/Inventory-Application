const { query, body, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.indexGetHomePage = (req, res) => {
    res.status(200).render("index");
};

exports.indexGetLanguagesList = async (req, res) => {
    const rows = await db.getAllLanguages();
    res.status(200).render("languages", { rows: rows });
};

exports.indexGetAuthorsList = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows });
};

exports.indexGetMangasList = async (req, res) => {
    const rows = await db.getAllMangas();
    console.log(rows);
    res.status(200).render("mangas",{rows: rows});
};

exports.indexGetPublishersList = async (req, res) => {
    const rows = await db.getAllPublishers();
    console.log(rows);
    res.status(200).render("publishers",{rows: rows});
};

exports.indexGetGenresList = async (req, res) => {
    const rows = await db.getAllGenres();
    res.status(200).render("genres", { rows: rows });
};
