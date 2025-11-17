const { Router } = require("express");
const genreController = require("../controllers/genreController.js");

const genreRouter = Router();

genreRouter.get("/", genreController.getGenresList);
genreRouter.get("/add", genreController.getAddGenre);
genreRouter.post("/add", genreController.postAddGenre);
genreRouter.post("/delete/:id", genreController.postDeleteGenre);
genreRouter.get("/update/:id",genreController.getUpdateGenre)
genreRouter.post("/update/:id",genreController.postUpdateGenre)

module.exports = genreRouter;
