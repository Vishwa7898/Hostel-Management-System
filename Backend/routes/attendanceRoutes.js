const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

// Middleware to protect routes
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
    }
    if (!token) res.status(401).json({ message: 'Not authorized, no token' });
};

// Check Out
router.post('/checkout', protect, async (req, res) => {
    try {
        const { purpose, description, expectedReturn } = req.body;
        const today = new Date().toISOString().split('T')[0];
        // Check if already checked out today
        const existing = await Attendance.findOne({ user: req.user._id, date: today, status: 'Outside' });
        if (existing) return res.status(400).json({ message: 'Already checked out' });
        
        const attendance = await Attendance.create({
            user: req.user._id,
            date: today,
            status: 'Outside',
            checkOutTime: new Date(),
            purpose: purpose || '',
            description: description || '',
            expectedReturn: expectedReturn ? new Date(expectedReturn) : null
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check In
router.post('/checkin', protect, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const existing = await Attendance.findOne({ user: req.user._id, date: today, status: 'Outside' });
        
        if (!existing) return res.status(400).json({ message: 'No active check-out found for today' });
        
        existing.status = 'Inside';
        existing.checkInTime = new Date();
        await existing.save();
        res.json(existing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all attendance (Admin)
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role === 'Student') return res.status(403).json({ message: 'Forbidden' });
        let records;
        if (req.query.date) {
            records = await Attendance.find({ date: req.query.date }).populate('user', 'name email studentId').sort({ createdAt: -1 });
        } else {
            records = await Attendance.find({}).populate('user', 'name email studentId').sort({ createdAt: -1 });
        }
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student gets their own attendance
router.get('/my', protect, async (req, res) => {
    try {
        const records = await Attendance.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export report (Admin)
router.get('/report', protect, async (req, res) => {
    try {
        if (req.user.role === 'Student') return res.status(403).json({ message: 'Forbidden' });
        const records = await Attendance.find({}).populate('user', 'name email studentId');
        
        let csv = 'Student Name,Email,Date,Status,CheckOut Time,CheckIn Time\n';
        records.forEach(r => {
            const outT = r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '';
            const inT = r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '';
            csv += `"${r.user?.name || 'N/A'}","${r.user?.email || 'N/A'}","${r.date}","${r.status}","${outT}","${inT}"\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('attendance_report.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update own attendance
router.put('/:id', protect, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ _id: req.params.id, user: req.user._id });
        if (!attendance) return res.status(404).json({ message: 'Record not found' });
        
        const { date, expectedReturn, purpose, description, checkInTime, checkOutTime, status } = req.body;
        
        if (date) attendance.date = date;
        if (status) attendance.status = status;
        if (purpose !== undefined) attendance.purpose = purpose;
        if (description !== undefined) attendance.description = description;
        if (expectedReturn !== undefined) attendance.expectedReturn = expectedReturn ? new Date(expectedReturn) : null;
        if (checkInTime !== undefined) attendance.checkInTime = checkInTime ? new Date(checkInTime) : null;
        if (checkOutTime !== undefined) attendance.checkOutTime = checkOutTime ? new Date(checkOutTime) : null;
        
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete own attendance
router.delete('/:id', protect, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ _id: req.params.id, user: req.user._id });
        if (!attendance) return res.status(404).json({ message: 'Record not found' });
        
        await Attendance.deleteOne({ _id: req.params.id });
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
