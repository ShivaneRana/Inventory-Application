const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.getPublishersList = async (req, res) => {
    const rows = await db.getAllPublishers();
    res.status(200).render("publishers", { rows: rows });
};
