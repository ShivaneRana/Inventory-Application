const { Router } = require("express");
const languageController = require("../controllers/languageController.js");
const languageRouter = Router();

languageRouter.get("/",languageController.getLanguagesList);

module.exports = languageRouter;
