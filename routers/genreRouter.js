const { Router } = require("express");
const genreController = require("../controllers/genreController.js");

const genreRouter = Router();

genreRouter.get("/",genreController.getGenresList);

module.exports = genreRouter;
