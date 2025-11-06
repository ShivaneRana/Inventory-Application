const {
    body,
    param,
    validationResult,
    matchedData,
} = require("express-validator");
const db = require("../db/queries.js");

validationObject = [
    body("publisher_name")
        .trim()
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage(
            "Publisher name only contain alphabet letters or numbers."
        ),
    body("publisher_country")
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Publisher country can only contain alphabet letters."),
];

exports.getPublishersList = async (req, res) => {
    const rows = await db.getAllPublishers();
    res.status(200).render("publishers", { rows: rows, flag: false });
};

exports.getAddPublisher = async (req, res) => {
    const rows = await db.getAllPublishers();
    res.status(200).render("publishers", { rows: rows, flag: true });
};

exports.postAddPublisher = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllPublishers();
            return res.status(404).render("publishers", {
                rows: rows,
                flag: true,
                errors: errors.array(),
            });
        }

        const { publisher_name, publisher_country } = matchedData(req);
        db.addPublisher(publisher_name, publisher_country);
        return res.status(200).redirect("/publishers");
    },
];
