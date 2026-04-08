const express = require('express');
const router = express.Router();
const multer = require('multer');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const uploadFood = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && ['Admin', 'Warden', 'Accountant'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Health check (public)
router.get('/health', (req, res) => {
  res.json({ ok: true, module: 'food', message: 'Food API is running' });
});

// Get menu by meal time (public for ordering)
router.get('/menu', async (req, res) => {
  try {
    const { mealTime } = req.query;
    const filter = { isActive: true };
    if (mealTime) filter.mealTime = mealTime;
    const items = await FoodItem.find(filter).lean();
    res.json(items);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Create order (protected - student)
router.post('/order', protect, async (req, res) => {
  try {
    const { regNumber, name, hostelRoom, mealTime, items } = req.body;
    if (!regNumber || !name || !hostelRoom || !mealTime || !items?.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let totalAmount = 0;
    const orderItems = [];
    for (const it of items) {
      const food = await FoodItem.findById(it.foodItemId);
      if (!food) return res.status(400).json({ message: `Food item ${it.foodItemId} not found` });
      const qty = Math.max(1, parseInt(it.quantity) || 1);
      totalAmount += food.price * qty;
      orderItems.push({ foodItem: food._id, quantity: qty });
    }

    const order = await Order.create({
      student: req.user._id,
      regNumber,
      studentName: name,
      hostelRoom,
      mealTime,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student: Get my orders
router.get('/orders/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id })
      .populate('items.foodItem', 'name price imageUrl')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const { status, mealTime, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (mealTime) filter.mealTime = mealTime;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }
    const orders = await Order.find(filter)
      .populate('student', 'name email studentId')
      .populate('items.foodItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all food items
router.get('/items', protect, adminOnly, async (req, res) => {
  try {
    const { mealTime } = req.query;
    const filter = {};
    if (mealTime) filter.mealTime = mealTime;
    const items = await FoodItem.find(filter).sort({ mealTime: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create food item (supports multipart with image)
router.post('/items', protect, adminOnly, uploadFood.single('image'), async (req, res) => {
  try {
    const { name, description, price, mealTime, imageUrl, isVegetarian } = req.body || {};
    if (!name || !price || !mealTime) {
      return res.status(400).json({ message: 'Name, price and mealTime are required' });
    }
    const imgUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : (imageUrl || '🍽️');
    const item = await FoodItem.create({
      name,
      description: description || '',
      price: parseFloat(price),
      mealTime,
      imageUrl: imgUrl,
      isVegetarian: isVegetarian === 'true' || isVegetarian === true,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update food item (supports multipart with image)
router.put('/items/:id', protect, adminOnly, uploadFood.single('image'), async (req, res) => {
  try {
    const { name, description, price, mealTime, imageUrl, isVegetarian } = req.body || {};
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (mealTime !== undefined) updates.mealTime = mealTime;
    if (isVegetarian !== undefined) updates.isVegetarian = isVegetarian === 'true' || isVegetarian === true;
    if (req.file) {
      updates.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    else if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const item = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    res.json(item);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete food item
router.delete('/items/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
