const {query,body, validationResult} = require("express-validator");
const db = require("../db/queries.js");

exports.indexGetHomePage = (req,res) => {
    res.status(200).render("index");
};

exports.indexGetCategoriesList = (req,res) => {
    res.status(200).render("categories");
}

exports.indexGetLanguagesList = async (req,res) => {
    const rows = await db.getAllLanguages();
    console.log(rows);
    res.status(200).render("languages");
}

exports.indexGetAuthorsList = async (req,res) => {
    const rows = await db.getAllAuthors();
    console.log(rows);
    res.status(200).send("authors");
}

exports.indexGetMangasList = async (req,res) => {
    const rows = await db.getAllMangas();
    console.log(rows);
    res.status(200).send("mangas");
}

exports.indexGetPublishersList = async (req,res) => {
    const rows = await db.getAllPublishers();
    console.log(rows);
    res.status(200).send("publishers");
}

exports.indexGetGenresList = async (req,res) => {
    const rows = await db.getAllGenres();
    console.log(rows);
    res.status(200).send("genres");
}