const { Router } = require("express");
const publisherController = require("../controllers/publisherController.js");
const publisherRouter = Router();

publisherRouter.get("/",publisherController.getPublishersList);

module.exports = publisherRouter;
