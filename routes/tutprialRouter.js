var express = require("express");
var router = express.Router();
const tutorialController = require("../controller/tutorialController");

/* GET home page. */
router.get("/", tutorialController.getTutorials);

router.post("/", tutorialController.postTutorials);

router.put("/", tutorialController.putTutorials);

router.delete("/", tutorialController.deleteTutorials);

router.get("/:tutorialId", tutorialController.getTutorial);

router.post("/:tutorialId", tutorialController.postTutorial);

router.put("/:tutorialId", tutorialController.putTutorial);

router.delete("/:tutorialId", tutorialController.deleteTutorial);

module.exports = router;
