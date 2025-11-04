const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");



exports.getLanguagesList = async (req, res) => {
    const rows = await db.getAllLanguages();
    res.status(200).render("languages", { rows: rows });
};