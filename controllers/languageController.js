const {
    body,
    param,
    validationResult,
    matchedData,
} = require("express-validator");
const db = require("../db/queries.js");

const validationObject = [
    body("language_name")
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Language can only contains alphabet letters."),
];

exports.getLanguagesList = async (req, res) => {
    const rows = await db.getAllLanguages();
    res.status(200).render("languages", { rows: rows, flag: false });
};

exports.getAddLanguage = async (req, res) => {
    const rows = await db.getAllLanguages();
    res.status(200).render("languages", { rows: rows, flag: true });
};

exports.postAddLanguage = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllLanguages();
            return res.status(404).render("languages", {
                rows: rows,
                flag: true,
                errors: errors.array(),
            });
        }

        const { language_name } = matchedData(req);
        await db.addLanguage(language_name);
        return res.status(200).redirect("/languages");
    },
];

exports.postDeleteLanguage = async(req,res) => {
    const {id} = req.params;
    await db.deleteLanguage(id);
    return res.status(200).redirect("/languages")
};
