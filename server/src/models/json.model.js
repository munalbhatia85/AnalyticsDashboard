const mongoose = require('mongoose');

const JsonSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JsonData', JsonSchema);
