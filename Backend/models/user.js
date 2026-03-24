const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    studentPhone: { type: String },
    guardianName: { type: String },
    contactNumber: { type: String },
    profilePhoto: { type: String },
    nicFront: { type: String },
    nicBack: { type: String },
    role: { 
        type: String, 
        enum: ['Student', 'Warden', 'Admin', 'Accountant'], 
        default: 'Student' },
    studentId: { type: String }
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
