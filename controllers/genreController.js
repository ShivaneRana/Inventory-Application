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
        .withMessage("Genre name should be in alphabetic letters.")
        .custom(async (value, { req }) => {
            const { id } = req.params;
            const rows = await db.getAllGenres();
            const result = rows.find((genre) => genre.genre_name === value);

            if (!result) {
                return true;
            }

            if (result.genre_id === Number(id)) {
                return true;
            }

            throw new Error("Duplicate genre are not allowed.");
        }),
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

exports.postDeleteGenre = async (req, res) => {
    const { id } = req.params;
    await db.deleteGenre(id);
    return res.status(200).redirect("/genres");
};

exports.getUpdateGenre = async (req, res) => {
    const { id } = req.params;
    const rows = await db.getAllGenres();
    const value = (await db.getAllGenres()).find(
        (item) => item.genre_id === Number(id)
    );
    return res.status(200).render("genres", {
        rows: rows,
        flag: true,
        update: true,
        value: value,
    });
};

exports.postUpdateGenre = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllGenres();
            const { id } = req.params;
            const value = (await db.getAllGenres()).find(
                (item) => item.genre_id === Number(id)
            );
            return res.status(400).render("genres", {
                rows: rows,
                flag: true,
                update: true,
                value: value,
                errors: errors.array(),
            });
        }

        const { id } = req.params;
        const { genre_name } = matchedData(req);
        await db.updateGenre(id, genre_name);
        return res.status(200).redirect("/genres");
    },
];
