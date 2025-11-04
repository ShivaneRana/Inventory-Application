const { query, body, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.indexGetHomePage = (req, res) => {
    res.status(200).render("index");
};
