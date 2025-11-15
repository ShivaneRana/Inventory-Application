const { Router } = require("express");
const languageController = require("../controllers/languageController.js");
const languageRouter = Router();

languageRouter.get("/", languageController.getLanguagesList);
languageRouter.get("/add", languageController.getAddLanguage);
languageRouter.post("/add", languageController.postAddLanguage);
languageRouter.post("/delete/:id", languageController.postDeleteLanguage);
languageRouter.get("/update/:id", languageController.getUpdateLanguages);
languageRouter.post("/update/:id", languageController.postUpdateLanguage);

module.exports = languageRouter;
