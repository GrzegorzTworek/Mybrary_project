const mongoose = require("mongoose");
const Tractor = require("./tractor");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("remove", function (next) {
  Tractor.find({ author: this.id }, (err, tractors) => {
    if (err) {
      next(err);
    } else if (tractors.length > 0) {
      next(new Error("This author has tractors still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Author", authorSchema);
