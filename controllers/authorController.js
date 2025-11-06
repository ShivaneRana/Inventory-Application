const { body, param, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries.js");

const validationObject = [
    body("author_name").trim().matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage(
        "Author name can only contain alphabets and numeric value"
    ),
    body("author_age").trim().isNumeric()
    .withMessage("Author age can only contain numeric value"),
    body("author_country").trim().matches(/^[a-zA-Z\s]+$/)
    .withMessage("Author country can only contain alphabet letters."),
]

exports.getAuthorsList = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows ,flag:false});
};

exports.getAddAuthor = async (req, res) => {
    const rows = await db.getAllAuthors();
    res.status(200).render("authors", { rows: rows ,flag:true});
};

exports.postAddAuthor = [
    validationObject,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const rows = await db.getAllAuthors();
            return res.status(404).render("authors",{rows:rows, flag: true, errors: errors.array()})
        }
        
        const {author_name,author_country,author_gender,author_age} = matchedData(req);
        return res.status(200).redirect("/authors");
    }
]