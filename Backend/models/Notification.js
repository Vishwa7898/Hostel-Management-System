const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipientRole: {
            type: String,
            enum: ['Student', 'Warden', 'Admin', 'Accountant'],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['attendance_overdue', 'general'],
            default: 'general'
        },
        attendance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attendance',
            default: null
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
