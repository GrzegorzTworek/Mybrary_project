const mongoose = require("mongoose");
// const path = require("path");
// const pictureImageBasePath = "uploads/tractorPictures";

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
  pagePrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pictureImage: {
    type: Buffer,
    required: true,
  },
  pictureImageType: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Brand",
  },
});

tractorSchema.virtual("pictureImagePath").get(function () {
  if (this.pictureImage != null && this.pictureImageType != null) {
    // return path.join("/", pictureImageBasePath, this.pictureImageName);
    return `data:${
      this.pictureImageType
    };charset=utf-8;base64,${this.pictureImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Tractor", tractorSchema);
// module.exports.pictureImageBasePath = pictureImageBasePath;
