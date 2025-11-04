const { Router } = require("express");
const authorController = require("../controllers/authorController.js");

const authorRouter = Router();

authorRouter.get("/", authorController.getAuthorsList);

module.exports = authorRouter;
