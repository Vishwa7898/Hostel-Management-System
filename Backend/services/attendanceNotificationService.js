const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const User = require('../models/user');

const createOverdueNotifications = async () => {
    const now = new Date();

    const overdueRecords = await Attendance.find({
        status: 'Outside',
        expectedReturn: { $ne: null, $lt: now },
        overdueNotificationSent: false
    }).populate('user', 'name role');

    if (!overdueRecords.length) {
        return { processed: 0 };
    }

    const adminAndWardens = await User.find(
        { role: { $in: ['Admin', 'Warden'] } },
        '_id role'
    );

    let processed = 0;

    for (const record of overdueRecords) {
        if (!record.user?._id) {
            continue;
        }

        const studentName = record.user.name || 'Unknown Student';
        const notificationsToCreate = [
            {
                recipient: record.user._id,
                recipientRole: record.user.role || 'Student',
                title: 'Return Time Exceeded',
                message: 'Student your return time is exceeded, please come back to the hostel soon.',
                type: 'attendance_overdue',
                attendance: record._id
            }
        ];

        adminAndWardens.forEach((adminUser) => {
            notificationsToCreate.push({
                recipient: adminUser._id,
                recipientRole: adminUser.role,
                title: 'Student Return Time Exceeded',
                message: `${studentName} student return time is exceeded.`,
                type: 'attendance_overdue',
                attendance: record._id
            });
        });

        await Notification.insertMany(notificationsToCreate);
        record.overdueNotificationSent = true;
        await record.save();
        processed += 1;
    }

    return { processed };
};

module.exports = { createOverdueNotifications };
