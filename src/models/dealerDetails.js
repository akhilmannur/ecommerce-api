const mongoose = require('mongoose')

const DealerDetailsSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  }
})

const DealerDetails = mongoose.model("dealer-details", DealerDetailsSchema)

module.exports = DealerDetails