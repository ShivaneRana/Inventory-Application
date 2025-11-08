const {
    body,
    param,
    validationResult,
    matchedData,
} = require("express-validator");
const db = require("../db/queries.js");

const validationObject = [
    body("genre_name")
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Genre name should be in alphabetic letters."),
];

exports.getGenresList = async (req, res) => {
    const rows = await db.getAllGenres();
    res.status(200).render("genres", { rows: rows, flag: false });
};

exports.getAddGenre = async (req, res) => {
    const rows = await db.getAllGenres();
    res.status(200).render("genres", { rows: rows, flag: true });
};

exports.postAddGenre = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllGenres();
            return res.status(400).render("genres", {
                rows: rows,
                flag: true,
                errors: errors.array(),
            });
        }

        const { genre_name } = matchedData(req);
        await db.addGenre(genre_name);
        return res.status(200).redirect("/genres");
    },
];
