const Tutorial = require("../models/Tutorial");

module.exports.getTutorials = (req, res, next) => {
  Tutorial.find({})
    .then((tutorials) => {
      return res.status(200).json({
        data: tutorials,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal error",
      });
    });
};

module.exports.putTutorials = (req, res, next) => {
  return res.status(403).json({
    message: "Not supported operation",
  });
};

module.exports.postTutorials = (req, res, next) => {
  const newTutorial = new Tutorial(req.body);

  newTutorial
    .save()
    .then((data) => {
      return res.status(200).json({
        message: "Successfully created",
        data: {
          tutorial: newTutorial,
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    });
};

module.exports.deleteTutorials = (req, res, next) => {
  Tutorial.deleteMany({}).then((data) => {
    return res
      .status(200)
      .json({ message: "Successfully deleted all", data: data });
  });
};

module.exports.getTutorial = (req, res, next) => {
  const tutorialId = req.params.tutorialId;

  Tutorial.findById(tutorialId)
    .then((data) => {
      return res.status(200).json({
        message: "Successfully",
        data: {
          tutorial: data,
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
};

module.exports.postTutorial = (req, res, next) => {
  return res.status(403).json({
    message: "Not supported operation",
  });
};

module.exports.deleteTutorial = (req, res, next) => {
  const tutorialId = req.params.tutorialId;

  Tutorial.findByIdAndRemove(tutorialId)
    .then((data) => {
      return res.status(200).json({
        message: "Successfully deleted tutorial",
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
};

module.exports.putTutorial = (req, res, next) => {
  const tutorialId = req.params.tutorialId;
  const newTutorialUpdate = new Tutorial(req.body);

  Tutorial.findByIdAndUpdate(
    tutorialId,
    {
      $set: {
        Title: newTutorialUpdate.Title,
        Author: newTutorialUpdate.Author,
        Genre: newTutorialUpdate.Genre,
      },
    },
    {
      new: true,
    }
  )
    .then((data) => {
      return res.status(200).json({
        message: "Updated tutorial successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
};
