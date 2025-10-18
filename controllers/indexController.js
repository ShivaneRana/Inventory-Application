const {query,body, validationResult} = require("express-validator");

exports.indexGetHomePage = (req,res) => {
    res.status(200).render("index");
};

exports.indexGetCategoriesList = (req,res) => {
    res.status(200).render("categories");
}

exports.indexGetLanguagesList = (req,res) => {
    res.status(200).render("languages");
}

exports.indexGetAuthorsList = (req,res) => {
    res.status(200).send("authors");
}

exports.indexGetMangasList = (req,res) => {
    res.status(200).send("mangas");
}

exports.indexGetPublishersList = (req,res) => {
    res.status(200).send("publishers");
}

exports.indexGetGenresList = (req,res) => {
    res.status(200).send("genres");
}