const {
    body,
    param,
    validationResult,
    matchedData,
} = require("express-validator");
const db = require("../db/queries.js");

const validationObject = [
    body("author_fullname")
        .trim()
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage("Author name can only contain alphabets and numeric value")
        .custom(async (value, { req }) => {
            const rows = await db.getAllAuthors();
            const result = rows.find(
                (author) => author.author_fullname === value
            );
            const { id } = req.params;

            if (!result) {
                return true;
            }

            if (result.author_id === Number(id)) {
                return true;
            }

            throw new Error("Duplicate author are not allowed.");
        }),
    body("author_age")
        .trim()
        .isNumeric()
        .withMessage("Author age can only contain numeric value"),
    body("author_country_of_origin")
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Author country can only contain alphabet letters."),
    body("author_gender")
        .isIn(["Male", "Female", "Other"])
        .withMessage("Author gender must be Male,Female or Other"),
];

exports.getAuthorsList = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows, flag: false, value: {} });
};

exports.getAddAuthor = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows, flag: true, value: {} });
};

exports.postAddAuthor = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllAuthors();
            return res.status(404).render("authors", {
                rows: rows,
                flag: true,
                value: {},
                errors: errors.array(),
            });
        }

        const {
            author_fullname,
            author_country_of_origin,
            author_gender,
            author_age,
        } = matchedData(req);

        await db.addAuthor(
            author_fullname,
            author_gender,
            author_age,
            author_country_of_origin
        );

        return res.status(200).redirect("/authors");
    },
];

exports.postDeleteAuthor = async (req, res) => {
    const { id } = req.params;
    await db.deleteAuthor(id);
    res.status(200).redirect("/authors");
};

exports.getUpdateAuthor = async (req, res) => {
    const { id } = req.params;
    const rows = await db.getAllAuthors();
    const value = rows.find((item) => item.author_id === Number(id));
    res.status(200).render("authors", {
        rows: rows,
        flag: true,
        update: true,
        value: value,
    });
};

exports.postUpdateAuthor = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const { id } = req.params;
            const rows = await db.getAllAuthors();
            const value = rows.find((item) => item.author_id === Number(id));
            return res.status(404).render("authors", {
                rows: rows,
                flag: true,
                update: true,
                value: value,
                errors: errors.array(),
            });
        }

        const { id } = req.params;

        const {
            author_fullname,
            author_country_of_origin,
            author_gender,
            author_age,
        } = matchedData(req);

        await db.updateAuthor(
            id,
            author_fullname,
            author_gender,
            author_age,
            author_country_of_origin
        );

        return res.status(200).redirect("/authors");
    },
];
