const mongoose = require('mongoose');

const accessPermissionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorName: { type: String, required: true },
    doctorCode: { type: String, default: '' },
    doctorSpecialty: { type: String },
    hospital: { type: String },
    isActive: { type: Boolean, default: true },
    accessType: { type: String, enum: ['full', 'limited', 'emergency', 'custom'], default: 'limited' },
    allowedRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }],
    allowMedicines: { type: Boolean, default: false },
    grantedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    accessLog: [{
        action: String,
        timestamp: { type: Date, default: Date.now },
        recordAccessed: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }
    }]
});

module.exports = mongoose.model('AccessPermission', accessPermissionSchema);
