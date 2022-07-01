const express = require("express");
const Author = require("../models/author");
const router = express.Router();

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
  // res.render("authors/index");
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    //   res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`);
  } catch {
    // let locals = { errorMessage: "Error creating Author" };
    res.render("authors/new", {
      author: author,
      //   locals,
      errorMessage: "Error creating Author",
    });
  }
  //   author.save((err, newAuthor) => {
  //     if (err) {
  //       let locals = { errorMessage: "Error creating Author" };
  //       res.render("authors/new", {
  //         author: author,
  //         locals,
  //       });
  //     } else {
  //       // res.redirect(`authors/${newAuthor.id}`)
  //       res.redirect(`authors`);
  //     }
  //   });
});

module.exports = router;
