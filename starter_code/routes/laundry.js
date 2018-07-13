const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LaundryPickup = require("../models/Laundry-pickup");
const session = require("express-session");

router.get("/dashboard", (req, res, next) => {
  let query;

  if (req.session.currentUser.isLaunderer) {
    query = { launderer: req.session.currentUser._id };
  } else {
    query = { user: req.session.currentUser._id };
  }

  LaundryPickup.find(query)
    .populate("user", "name")
    .populate("launderer", "name")
    .sort("pickupDate")
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }

      res.render("laundry/dashboard", {
        pickups: pickupDocs
      });
    });
});

router.post("/launderers", (req, res, next) => {
  const fee = req.body.name;
  if (fee === "") {
    res.render("laundry/dashboard", {
      errorMessage: "Enter a fee."
    });
    return;
  }

  console.log(req.body.fee);
  console.log(req.session.currentUser.email);

  User.findOneAndUpdate(
    { email: req.session.currentUser.email },
    { fee: req.body.fee, isLaunderer: true },
    { new: true }
  ).then(user => {
    res.redirect("/");
  });
});

router.get("/launderers", (req, res, next) => {
  User.find({
    isLaunderer: true,
    email: { $ne: req.session.currentUser.email }
  }).then(user => {
    console.log(user);
    res.render("laundry/launderers", {
      user
    });
  });
});

router.get("/launderers/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then(theLaunderer => {
      res.render("laundry/launderer-profile", { theLaunderer });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/laundry-pickups", (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.currentUser._id
  };
  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save(err => {
    if (err) {
      next(err);
      return;
    }

    res.redirect("/dashboard");
  });
});

module.exports = router;
