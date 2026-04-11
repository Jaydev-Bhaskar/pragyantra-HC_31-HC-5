const express = require('express');
const router = express.Router();
const HealthLog = require('../models/HealthLog');
const { protect } = require('../middleware/auth');

// @route   POST /api/logs
// @desc    Add a daily health log
router.post('/', protect, async (req, res) => {
    try {
        const { bp, sugar, cholesterol, heartRate, sleepHours, steps, dietScore, medicationAdherence, date } = req.body;
        
        const log = await HealthLog.create({
            userId: req.user._id,
            date: date || new Date(),
            bp,
            sugar,
            cholesterol,
            heartRate,
            sleepHours,
            steps,
            dietScore,
            medicationAdherence
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/logs/recent
// @desc    Get logs for the last 6 months
router.get('/recent', protect, async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const logs = await HealthLog.find({
            userId: req.user._id,
            date: { $gte: sixMonthsAgo }
        }).sort({ date: 1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
