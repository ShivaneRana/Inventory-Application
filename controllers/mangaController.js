const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.getMangasList = async (req, res) => {
    const rows = await db.getAllMangas();
    console.log(rows);
    res.status(200).render("mangas", { rows: rows });
};
