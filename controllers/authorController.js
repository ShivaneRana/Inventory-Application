const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.getAuthorsList = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows });
};