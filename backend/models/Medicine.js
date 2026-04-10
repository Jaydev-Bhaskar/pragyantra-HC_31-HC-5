const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, enum: ['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'], required: true },
    timings: [{ type: String }], // e.g., ["08:00 AM", "08:00 PM"]
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    notes: { type: String },
    prescribedBy: { type: String },
    refillDate: { type: Date },
    sideEffects: [String],
    adherenceLog: [{
        date: { type: Date, default: Date.now },
        taken: { type: Boolean, default: false },
        timing: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);
