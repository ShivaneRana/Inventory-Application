const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const indexRouter = Router();

indexRouter.get("/", indexController.indexGetHomePage);
indexRouter.get("/languages", indexController.indexGetLanguagesList);
indexRouter.get("/genres", indexController.indexGetGenresList);
indexRouter.get("/authors", indexController.indexGetAuthorsList);
indexRouter.get("/mangas", indexController.indexGetMangasList);
indexRouter.get("/publishers", indexController.indexGetPublishersList);

module.exports = indexRouter;
