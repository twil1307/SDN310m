var authenticate = require("../service/authenticate");

var express = require("express");
var router = express.Router();

router.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  next();
});

router.get("/", (req, res, next) => {
  res.end("Will send all the dishes to you");
});

router.post("/", authenticate.verifyUser, (req, res, next) => {
  res.end(
    "Will add the dish: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});

router.put("/", authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation is not supported on /dished");
});

router.delete("/", authenticate.verifyUser, (req, res, next) => {
  res.end("Deleting all dishes");
});

// http://localhost:8080/dishes/3
router.get("/:dishId", (req, res, next) => {
  res.end("Will send details of the dish: " + req.params.dishId + " to you!");
});

router.post("/:dishId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation is not supported on /dishes/" + req.params.dishId);
});

router.put("/:dishId", (req, res, next) => {
  res.write("Updating the dish: " + req.params.dishId + "\n");
  res.end(
    "Will update the dish: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});

router.delete("/:dishId", (req, res, next) => {
  res.end("Deleting the dish: " + req.params.dishId);
});

module.exports = router;

module.exports = router;
