const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['lab_report', 'prescription', 'scan', 'fitness', 'vaccination', 'other'], required: true },
    description: { type: String },
    fileUrl: { type: String },
    fileName: { type: String },
    aiParsedData: {
        medicines: [{ name: String, dosage: String, frequency: String, duration: String }],
        diagnosis: String,
        doctorName: String,
        summary: String,
        keyMetrics: [{ name: String, value: String, unit: String, status: String }]
    },
    isVerified: { type: Boolean, default: false },
    source: { type: String, default: 'manual_upload' },
    blockchainHash: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
