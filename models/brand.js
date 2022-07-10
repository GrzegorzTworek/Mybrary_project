const mongoose = require("mongoose");
const Tractor = require("./tractor");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

brandSchema.pre("remove", function (next) {
  Tractor.find({ brand: this.id }, (err, tractors) => {
    if (err) {
      next(err);
    } else if (tractors.length > 0) {
      next(new Error("This brand has tractors still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Brand", brandSchema);
