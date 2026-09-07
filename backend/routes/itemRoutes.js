const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Default import
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { name, quantity, price, category } = req.body;
    if (!name || quantity === undefined || price === undefined || !category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const newItem = await Item.create({
      name,
      quantity: Number(quantity),
      price: Number(price),
      category
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;