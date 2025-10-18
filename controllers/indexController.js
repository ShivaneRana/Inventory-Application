const {query,body, validationResult} = require("express-validator");

exports.indexGetHomePage = (req,res) => {
    res.status(200).send("This will be the homepage");
};

exports.indexGetCategoriesList = (req,res) => {
    res.status(200).send("List of all the categories");
}

exports.indexGetLanguagesList = (req,res) => {
    res.status(200).send("List of all the languages");
}

exports.indexGetAuthorsList = (req,res) => {
    res.status(200).send("List of all the authors");
}

exports.indexGetMangasList = (req,res) => {
    res.status(200).send("List of all the mangas");
}

exports.indexGetPublishersList = (req,res) => {
    res.status(200).send("List of all the publishers");
}

exports.indexGetGenresList = (req,res) => {
    res.status(200).send("List of all the genres");
}