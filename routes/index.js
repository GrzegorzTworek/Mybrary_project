const express = require("express");
const router = express.Router();
const Tractor = require("../models/tractor");

router.get("/", async (req, res) => {
  let tractors;
  try {
    tractors = await Tractor.find()
      .sort({ createdAt: "desc" })
      .limit(10)
      .exec();
  } catch {
    tractors = [];
  }
  res.render("index", { tractors: tractors });
});

module.exports = router;
