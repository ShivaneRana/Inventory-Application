const {query,body, validationResult} = require("express-validator");

exports.indexGetHomePage = (req,res) => {
    res.status(200).send("This will be the homepage");
};