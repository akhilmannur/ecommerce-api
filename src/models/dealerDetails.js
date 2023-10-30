const mongoose = require('mongoose')

const DealerDetailsSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  }, 
  password: {
    required: true,
    type: String
  },
  accessKey: {
    type: String
  }
})

const DealerDetails = mongoose.model("dealer-details", DealerDetailsSchema)

module.exports = DealerDetails