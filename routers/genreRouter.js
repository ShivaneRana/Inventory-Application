const { Router } = require("express");
const genreController = require("../controllers/genreController.js");

const genreRouter = Router();

genreRouter.get("/", genreController.getGenresList);
genreRouter.get("/add", genreController.getAddGenre);
genreRouter.post("/add", genreController.postAddGenre);
module.exports = genreRouter;
