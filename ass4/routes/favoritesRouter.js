const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
const router = express.Router();
var authenticate = require("../authenticate");
const Favorites = require("../models/favorites");
const Dishes = require("../models/dishes");
const User = require("../models/users");

router.use(bodyParser.json());

router.get("/", authenticate.verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorites.find({ userId: userId })
      .populate("dishId")
      .populate("userId");

    return res.status(200).json({
      favorites: favorites,
      userId: userId,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate.verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = req.body.data;

    console.log(userId);

    if (data) {
      // get current user
      const currentUser = await User.findById(userId);

      //   filter out the dish id that is not include in the current user favorite array
      const filteredArray = data.filter(
        (obj) => !currentUser.favorites.includes(obj._id)
      );

      if (filteredArray.length == 0) {
        return res.status(200).json({
          message: "All favorites are already",
        });
      }

      const extractedDocument = filteredArray.map((obj) => ({
        dishId: new mongoose.Types.ObjectId(obj._id),
        userId: userId,
      }));

      // save favorite
      const insertedFavorites = await Favorites.insertMany(extractedDocument);

      const newFavoriteIds = insertedFavorites.map(
        (favorites) => favorites.dishId
      );

      currentUser.favorites = [...currentUser.favorites, ...newFavoriteIds];

      // update user favorites
      const newUserUpdate = await currentUser.save();

      return res.status(200).json({
        favoritesAdd: newUserUpdate,
      });
    }

    const favorites = await Favorites.find({ userId: userId }).populate(
      "dishId",
      "userId"
    );

    return res.status(200).json({
      favorites: favorites,
      userId: userId,
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/", authenticate.verifyUser, async (req, res, next) => {
  return res.status(400).json({ message: "Method not supported" });
});

router.delete("/", authenticate.verifyUser, async (req, res, next) => {
  try {
    await Favorites.deleteMany({ userId: req.user._id });

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:dishId", authenticate.verifyUser, async (req, res, next) => {
  try {
    console.log(req.params.dishId);
    const dish = await Dishes.findById(req.params.dishId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    } else {
      const currentUser = await User.findOne(req.user._id);
      // currentUser.favorites = [...currentUser.favorites, req.params.dishId];
      console.log(currentUser);
      if (currentUser.favorites.includes(req.params.dishId)) {
        return res
          .status(400)
          .json({ message: "Already added this dish in your favorite" });
      }

      currentUser.favorites.push(req.params.dishId);
      await currentUser.save();

      const newFavorite = new Favorites({
        dishId: req.params.dishId,
        userId: req.user._id,
      });
      await newFavorite.save();

      return res.status(200).json({ message: "Success add new favorite dish" });
    }
  } catch (error) {
    console.log("Error");
    next(error);
  }
});

router.delete("/:dishId", authenticate.verifyUser, async (req, res, next) => {
  try {
    console.log(req.params.dishId);
    const dish = await Dishes.findById(req.params.dishId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    } else {
      const currentUser = await User.findById(req.user._id);

      const index = currentUser.favorites.indexOf(req.params.dishId);

      if (index < 0) {
        return res
          .status(500)
          .json({ message: "There is no such dish in your favorites" });
      }

      currentUser.favorites.splice(index, 1);

      await Favorites.findOneAndDelete({ dishId: req.params.dishId });

      await currentUser.save();

      return res.status(200).json({ message: "Success delete favorite dish" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not support on /promotion");
});

module.exports = router;
