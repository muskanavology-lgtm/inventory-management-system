const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Item category is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);