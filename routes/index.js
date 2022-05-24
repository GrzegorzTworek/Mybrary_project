const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // res.send("Hello worldd");
  res.render("index");
  // res.send("Hello worldd");
});

module.exports = router;
