const { Router } = require("express");
const publisherController = require("../controllers/publisherController.js");
const publisherRouter = Router();

publisherRouter.get("/", publisherController.getPublishersList);
publisherRouter.get("/add", publisherController.getAddPublisher);
publisherRouter.post("/add", publisherController.postAddPublisher);
publisherRouter.post("/delete/:id", publisherController.postDeletePublisher);
publisherRouter.get("/update/:id", publisherController.getUpdatePublisher);
publisherRouter.post("/update/:id", publisherController.postUpdatePublisher);

module.exports = publisherRouter;
