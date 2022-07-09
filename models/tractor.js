const mongoose = require("mongoose");
// const path = require("path");
// const coverImageBasePath = "uploads/tractorCovers";

const tractorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  productionDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Brand",
  },
});

tractorSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    // return path.join("/", coverImageBasePath, this.coverImageName);
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Tractor", tractorSchema);
// module.exports.coverImageBasePath = coverImageBasePath;
