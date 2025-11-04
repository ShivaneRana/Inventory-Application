const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.getGenresList = async (req, res) => {
    const rows = await db.getAllGenres();
    res.status(200).render("genres", { rows: rows });
};
