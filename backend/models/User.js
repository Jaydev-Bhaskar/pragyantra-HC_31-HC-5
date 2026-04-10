const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    aadhaarId: { type: String },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    profilePhoto: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    age: { type: Number },
    healthId: { type: String, unique: true },
    // Doctor-specific fields
    doctorCode: { type: String, unique: true, sparse: true },
    specialty: { type: String },
    hospital: { type: String },
    licenseNumber: { type: String },
    // Patient fields
    allergies: [String],
    chronicIllnesses: [String],
    currentMedications: [String],
    emergencyContact: { name: String, phone: String, relation: String },
    healthScore: { type: Number, default: 500 },
    familyMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (!this.healthId) {
        this.healthId = 'HV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    // Auto-generate doctor code: DR-<4 alpha> e.g. DR-ABCD
    if (this.role === 'doctor' && !this.doctorCode) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'DR-';
        for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
        this.doctorCode = code;
    }
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
