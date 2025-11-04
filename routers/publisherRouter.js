const { Router } = require("express");
const publisherController = require("../controllers/publisherController.js");
const publisherRouter = Router();

publisherRouter.get("/", publisherController.getPublishersList);
publisherRouter.get("/add", publisherController.getAddPublisher);
publisherRouter.post("/add", publisherController.postAddPublisher);

module.exports = publisherRouter;
