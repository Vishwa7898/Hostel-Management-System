const express = require('express');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Student = require('../models/Student');

const router = express.Router();

// Simple test route to confirm backend + food module works
router.get('/health', (req, res) => {
  res.json({ ok: true, module: 'food', message: 'Food routes working' });
});

// GET /api/food/menu?mealTime=breakfast|lunch|dinner
router.get('/menu', async (req, res) => {
  try {
    const { mealTime } = req.query;

    const query = { isActive: true };
    if (mealTime) {
      query.mealTime = mealTime;
    }

    const items = await FoodItem.find(query).sort({ mealTime: 1, name: 1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
});

// POST /api/food/order  (student places an order)
// body: { regNumber, name, hostelRoom, mealTime, items: [{ foodItemId, quantity }] }
router.post('/order', async (req, res) => {
  try {
    const { regNumber, name, hostelRoom, mealTime, items } = req.body;

    if (!regNumber || !name || !hostelRoom || !mealTime || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const foodIds = items.map((i) => i.foodItemId);
    const foodDocs = await FoodItem.find({ _id: { $in: foodIds }, isActive: true });
    const foodMap = new Map(foodDocs.map((f) => [String(f._id), f]));

    let totalAmount = 0;
    const orderItems = [];

    for (const it of items) {
      const doc = foodMap.get(String(it.foodItemId));
      if (!doc) continue;

      const quantity = Number(it.quantity) || 1;
      totalAmount += doc.price * quantity;

      orderItems.push({
        foodItem: doc._id,
        quantity,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in order' });
    }

    const student =
      (await Student.findOneAndUpdate(
        { regNumber },
        { name, hostelRoom },
        { new: true }
      )) ||
      (await Student.create({
        regNumber,
        name,
        hostelRoom,
      }));

    const order = await Order.create({
      student: student._id,
      regNumber,
      studentName: name,
      hostelRoom,
      mealTime,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

module.exports = router;

