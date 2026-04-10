const express = require('express');
const router = express.Router();
const AccessPermission = require('../models/AccessPermission');
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');
const QRCode = require('qrcode');
const User = require('../models/User');

// Grant access to a doctor (by doctorCode or manual entry)
router.post('/grant', protect, async (req, res) => {
    try {
        const { doctorCode, doctorId, doctorName, doctorSpecialty, hospital, accessType, expiresAt } = req.body;

        let doctor = null;
        // Try to find a real doctor by code
        if (doctorCode) {
            doctor = await User.findOne({ doctorCode, role: 'doctor' });
        } else if (doctorId) {
            doctor = await User.findById(doctorId);
        }

        const permission = await AccessPermission.create({
            patient: req.user._id,
            doctor: doctor ? doctor._id : undefined,
            doctorName: doctor ? doctor.name : (doctorName || 'Unknown Doctor'),
            doctorSpecialty: doctor ? doctor.specialty : (doctorSpecialty || ''),
            doctorCode: doctor ? doctor.doctorCode : (doctorCode || ''),
            hospital: doctor ? doctor.hospital : (hospital || ''),
            accessType: accessType || 'full',
            expiresAt
        });
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all active permissions
router.get('/', protect, async (req, res) => {
    try {
        const permissions = await AccessPermission.find({ patient: req.user._id }).sort({ createdAt: -1 });
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle access (activate/deactivate)
router.put('/:id/toggle', protect, async (req, res) => {
    try {
        const permission = await AccessPermission.findById(req.params.id);
        if (permission && permission.patient.toString() === req.user._id.toString()) {
            permission.isActive = !permission.isActive;
            permission.accessLog.push({
                action: permission.isActive ? 'ACCESS_GRANTED' : 'ACCESS_REVOKED',
                timestamp: new Date()
            });
            await permission.save();
            res.json(permission);
        } else {
            res.status(404).json({ message: 'Permission not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Revoke access
router.delete('/:id', protect, async (req, res) => {
    try {
        const permission = await AccessPermission.findById(req.params.id);
        if (permission && permission.patient.toString() === req.user._id.toString()) {
            await permission.deleteOne();
            res.json({ message: 'Access revoked' });
        } else {
            res.status(404).json({ message: 'Permission not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate Emergency QR Code (with current active medicines)
router.get('/emergency-qr', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name bloodGroup allergies chronicIllnesses currentMedications emergencyContact healthId');
        const activeMeds = await Medicine.find({ patient: req.user._id, isActive: true }).select('name dosage frequency');
        const emergencyData = {
            healthId: user.healthId,
            name: user.name,
            bloodGroup: user.bloodGroup,
            allergies: user.allergies,
            conditions: user.chronicIllnesses,
            medications: activeMeds.map(m => `${m.name} ${m.dosage}`),
            emergencyContact: user.emergencyContact,
            generatedAt: new Date().toISOString()
        };
        const qrDataUrl = await QRCode.toDataURL(JSON.stringify(emergencyData), {
            width: 400,
            margin: 2,
            color: { dark: '#1b6968', light: '#ffffff' }
        });
        res.json({ qrCode: qrDataUrl, data: emergencyData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
