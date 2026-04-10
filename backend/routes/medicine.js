const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');

// Add a new medicine
router.post('/', protect, async (req, res) => {
    try {
        const { name, dosage, frequency, timings, startDate, endDate, notes, prescribedBy, refillDate, sideEffects } = req.body;
        const medicine = await Medicine.create({
            patient: req.user._id,
            name, dosage, frequency, timings,
            startDate: startDate || new Date(),
            endDate, notes, prescribedBy, refillDate, sideEffects
        });
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Batch add medicines
router.post('/batch', protect, async (req, res) => {
    try {
        const { medicines } = req.body;
        if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ message: 'Provide an array of medicines' });
        }
        const created = [];
        for (const med of medicines) {
            if (!med.name || !med.dosage) continue; // skip incomplete entries
            const medicine = await Medicine.create({
                patient: req.user._id,
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency || 'once_daily',
                timings: med.timings || ['09:00 AM'],
                startDate: med.startDate || new Date(),
                endDate: med.endDate,
                notes: med.notes || '',
                prescribedBy: med.prescribedBy || '',
                refillDate: med.refillDate,
                sideEffects: med.sideEffects || [],
                isActive: true
            });
            created.push(medicine);
        }
        res.status(201).json({ message: `${created.length} medicines added`, medicines: created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all medicines for logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const medicines = await Medicine.find({ patient: req.user._id }).sort({ isActive: -1, createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get active medicines only (for reminders)
router.get('/active', protect, async (req, res) => {
    try {
        const medicines = await Medicine.find({ patient: req.user._id, isActive: true }).sort({ createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update medicine
router.put('/:id', protect, async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine && medicine.patient.toString() === req.user._id.toString()) {
            Object.assign(medicine, req.body);
            const updated = await medicine.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Log adherence (mark as taken)
router.post('/:id/taken', protect, async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine && medicine.patient.toString() === req.user._id.toString()) {
            medicine.adherenceLog.push({
                date: new Date(),
                taken: true,
                timing: req.body.timing || 'manual'
            });
            await medicine.save();
            res.json({ message: 'Marked as taken', adherenceLog: medicine.adherenceLog });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete medicine
router.delete('/:id', protect, async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine && medicine.patient.toString() === req.user._id.toString()) {
            await medicine.deleteOne();
            res.json({ message: 'Medicine removed' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reminders (upcoming doses for today)
router.get('/reminders', protect, async (req, res) => {
    try {
        const medicines = await Medicine.find({ patient: req.user._id, isActive: true });
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const reminders = medicines.map(med => {
            const todayLogs = med.adherenceLog.filter(log =>
                log.date.toISOString().split('T')[0] === todayStr
            );
            const takenTimings = todayLogs.filter(l => l.taken).map(l => l.timing);

            return {
                _id: med._id,
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
                timings: med.timings,
                takenToday: takenTimings,
                pendingTimings: med.timings.filter(t => !takenTimings.includes(t)),
                refillDate: med.refillDate,
                needsRefill: med.refillDate && new Date(med.refillDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            };
        });

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
