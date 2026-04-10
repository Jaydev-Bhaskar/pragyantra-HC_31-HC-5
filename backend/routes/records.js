const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const HealthRecord = require('../models/HealthRecord');
const { protect } = require('../middleware/auth');

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload a health record
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        const { title, type, description } = req.body;
        const record = await HealthRecord.create({
            patient: req.user._id,
            title,
            type,
            description,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
            fileName: req.file ? req.file.originalname : ''
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all records for logged-in patient
router.get('/', protect, async (req, res) => {
    try {
        const records = await HealthRecord.find({ patient: req.user._id }).sort({ uploadedAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single record
router.get('/:id', protect, async (req, res) => {
    try {
        const record = await HealthRecord.findById(req.params.id);
        if (record && record.patient.toString() === req.user._id.toString()) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete record
router.delete('/:id', protect, async (req, res) => {
    try {
        const record = await HealthRecord.findById(req.params.id);
        if (record && record.patient.toString() === req.user._id.toString()) {
            await record.deleteOne();
            res.json({ message: 'Record deleted' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get health analytics (aggregated data)
router.get('/analytics/trends', protect, async (req, res) => {
    try {
        const records = await HealthRecord.find({ patient: req.user._id }).sort({ uploadedAt: -1 });
        const totalRecords = records.length;
        const verifiedCount = records.filter(r => r.isVerified).length;
        const typeBreakdown = {};
        records.forEach(r => { typeBreakdown[r.type] = (typeBreakdown[r.type] || 0) + 1; });

        // Extract key metrics from AI-parsed data
        const metrics = [];
        records.forEach(r => {
            if (r.aiParsedData && r.aiParsedData.keyMetrics) {
                r.aiParsedData.keyMetrics.forEach(m => {
                    metrics.push({ ...m.toObject(), date: r.uploadedAt });
                });
            }
        });

        res.json({
            totalRecords,
            verifiedCount,
            typeBreakdown,
            recentMetrics: metrics.slice(0, 20),
            healthConsistency: totalRecords > 0 ? Math.round((verifiedCount / totalRecords) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
