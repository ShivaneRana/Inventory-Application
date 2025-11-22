const { Router } = require("express");
const mangaController = require("../controllers/mangaController.js");

const mangaRouter = Router();

mangaRouter.get("/", mangaController.getMangasList);
mangaRouter.get("/add", mangaController.getAddManga);
mangaRouter.post("/add", mangaController.postAddManga);
mangaRouter.post("/delete/:id", mangaController.postDeleteManga);
mangaRouter.get("/update/:id", mangaController.getUpdateManga);
mangaRouter.post("/update/:id", mangaController.postUpdateManga);

module.exports = mangaRouter;
