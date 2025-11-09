const { Router } = require("express");
const authorController = require("../controllers/authorController.js");

const authorRouter = Router();

authorRouter.get("/", authorController.getAuthorsList);
authorRouter.get("/add", authorController.getAddAuthor);
authorRouter.post("/add", authorController.postAddAuthor);
authorRouter.post("/delete/:id", authorController.postDeleteAuthor);

module.exports = authorRouter;
