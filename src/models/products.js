const mongoose = require('mongoose')

  const ProductSchema = new mongoose.Schema({
    title: {
      required: true,
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    category: {
      type: String,
      required: true
    }
  })
  
  const Product = mongoose.model('products', ProductSchema)



module.exports = Product