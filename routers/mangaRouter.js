const { Router } = require("express");
const mangaController = require("../controllers/mangaController.js");

const mangaRouter = Router();

mangaRouter.get("/", mangaController.getMangasList);

module.exports = mangaRouter;
