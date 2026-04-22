const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Format YYYY-MM-DD
        required: true
    },
    status: {
        type: String,
        enum: ['Inside', 'Outside'],
        default: 'Inside'
    },
    checkOutTime: {
        type: Date
    },
    checkInTime: {
        type: Date
    },
    purpose: {
        type: String,
        enum: ['Shopping', 'Medical', 'Other', 'Home', '']
    },
    expectedReturn: {
        type: Date
    },
    description: {
        type: String
    },
    overdueNotificationSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
