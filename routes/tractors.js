const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
const Tractor = require("../models/tractor");
const Brand = require("../models/brand");
// const uploadPath = path.join("public", Tractor.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// All Tractors Route
router.get("/", async (req, res) => {
  let query = Tractor.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.producedBefore != null && req.query.producedBefore != "") {
    query = query.lte("productionDate", req.query.producedBefore);
  }
  if (req.query.producedAfter != null && req.query.producedAfter != "") {
    query = query.gte("productionDate", req.query.producedAfter);
  }

  try {
    const tractors = await query.exec();
    res.render("tractors/index", {
      tractors: tractors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Tractor Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Tractor());
});

// Create Tractor Route
// router.post("/", upload.single("cover"), async (req, res) => {
router.post("/", async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null;
  const tractor = new Tractor({
    title: req.body.title,
    brand: req.body.brand,
    productionDate: new Date(req.body.productionDate),
    pageCount: req.body.pageCount,
    // coverImageName: fileName,
    description: req.body.description,
  });

  saveCover(tractor, req.body.cover);

  try {
    const newTractor = await tractor.save();
    res.redirect(`tractors/${newTractor.id}`);
    // res.redirect(`tractors`);
  } catch {
    // if (tractor.coverImageName != null) {
    //   removeTractorCover(tractor.coverImageName);
    // }

    renderNewPage(res, tractor, true);
  }
});

// function removeTractorCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), (err) => {
//     if (err) console.error(err);
//   });
// }

// Show Tractor Route
router.get("/:id", async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id)
      .populate("brand")
      .exec();
    res.render("tractors/show", { tractor: tractor });
  } catch {
    res.redirect("/");
  }
});

// Edit Tractor Route
router.get("/:id/edit", async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);
    renderEditPage(res, tractor);
  } catch {
    res.redirect("/");
  }
});

// Update Tractor Route
router.put("/:id", async (req, res) => {
  let tractor;

  try {
    tractor = await Tractor.findById(req.params.id);
    tractor.title = req.body.title;
    tractor.brand = req.body.brand;
    tractor.productionDate = new Date(req.body.productionDate);
    tractor.pageCount = req.body.pageCount;
    tractor.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(tractor, req.body.cover);
    }
    await tractor.save();
    res.redirect(`/tractors/${tractor.id}`);
  } catch {
    if (tractor != null) {
      renderEditPage(res, tractor, true);
    } else {
      res.redirect("/");
      // redirect("/");
    }
  }
});

router.delete("/:id", async (req, res) => {
  let tractor;
  try {
    tractor = await Tractor.findById(req.params.id);
    await tractor.remove();
    res.redirect("/tractors");
  } catch {
    if (tractor != null) {
      res.render("tractors/show", {
        tractor: tractor,
        errorMessage: "Could not remove tractor",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, tractor, hasError = false) {
  renderFormPage(res, tractor, "new", hasError);
}

async function renderEditPage(res, tractor, hasError = false) {
  renderFormPage(res, tractor, "edit", hasError);
}

async function renderFormPage(res, tractor, form, hasError = false) {
  try {
    const brands = await Brand.find({});
    const params = {
      brands: brands,
      tractor: tractor,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Tractor";
      } else {
        params.errorMessage = "Error Creating Tractor";
      }
    }

    res.render(`tractors/${form}`, params);
  } catch {
    res.redirect("/tractors");
  }
}

function saveCover(tractor, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    tractor.coverImage = new Buffer.from(cover.data, "base64");
    tractor.coverImageType = cover.type;
  }
}

module.exports = router;
