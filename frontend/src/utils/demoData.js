// Demo data for when backend is not connected
export const demoUser = {
    _id: 'demo123',
    name: 'Aryan Sharma',
    email: 'aryan@healthvault.ai',
    role: 'patient',
    healthId: 'HV-M2X9K7PL',
    healthScore: 850,
    bloodGroup: 'O+',
    age: 28,
    phone: '+91 98765 43210',
    allergies: ['Penicillin', 'Dust'],
    chronicIllnesses: ['Mild Asthma'],
    currentMedications: ['Montelukast 10mg'],
    emergencyContact: { name: 'Priya Sharma', phone: '+91 87654 32109', relation: 'Spouse' },
    token: 'demo_token'
};

// Check if user is the demo user (so we only show static data for demo, not real users)
export const isDemoUser = (user) => {
    return user?._id === 'demo123' || user?.token === 'demo_token';
};

export const demoRecords = [
    {
        _id: '1',
        title: 'Dr. Sharma Prescription',
        type: 'prescription',
        description: 'Follow-up for seasonal asthma',
        isVerified: true,
        source: 'ai_ocr',
        uploadedAt: '2026-04-05T10:30:00Z',
        aiParsedData: {
            medicines: [
                { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
                { name: 'Cetirizine', dosage: '5mg', frequency: 'As needed', duration: '15 days' }
            ],
            diagnosis: 'Seasonal allergic rhinitis with mild asthma',
            doctorName: 'Dr. Rohit Sharma',
            summary: 'Patient shows improvement. Continue current medication and monitor.'
        }
    },
    {
        _id: '2',
        title: 'Apollo Blood Test Report',
        type: 'lab_report',
        description: 'Complete Blood Count & Lipid Profile',
        isVerified: true,
        source: 'manual_upload',
        uploadedAt: '2026-03-28T14:00:00Z',
        aiParsedData: {
            keyMetrics: [
                { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', status: 'normal' },
                { name: 'Total Cholesterol', value: '195', unit: 'mg/dL', status: 'normal' },
                { name: 'Blood Sugar (Fasting)', value: '98', unit: 'mg/dL', status: 'normal' },
                { name: 'Blood Pressure', value: '120/78', unit: 'mmHg', status: 'normal' }
            ],
            summary: 'All parameters within normal range. Cholesterol showing downward trend.'
        }
    },
    {
        _id: '3',
        title: 'City Hospital Chest X-Ray',
        type: 'scan',
        description: 'Annual chest X-ray for asthma monitoring',
        isVerified: false,
        source: 'manual_upload',
        uploadedAt: '2026-03-15T09:00:00Z',
        aiParsedData: {
            summary: 'No significant abnormalities detected. Lungs appear clear.'
        }
    },
    {
        _id: '4',
        title: 'COVID-19 Booster Vaccination',
        type: 'vaccination',
        description: 'Moderna Bivalent Booster dose',
        isVerified: true,
        source: 'cowin_sync',
        uploadedAt: '2026-02-10T11:00:00Z',
        aiParsedData: {
            summary: 'COVID-19 booster administered. Certificate verified via CoWIN.'
        }
    }
];

export const demoPermissions = [
    { _id: 'p1', doctorName: 'Dr. Rohit Sharma', doctorSpecialty: 'Pulmonologist', hospital: 'City Hospital, Pune', isActive: true, accessType: 'full', grantedAt: '2026-01-15T10:00:00Z' },
    { _id: 'p2', doctorName: 'Dr. Priya Desai', doctorSpecialty: 'General Physician', hospital: 'Apollo Clinic, Pune', isActive: true, accessType: 'limited', grantedAt: '2026-03-01T10:00:00Z' },
    { _id: 'p3', doctorName: 'Dr. Aman Kulkarni', doctorSpecialty: 'Cardiologist', hospital: 'Ruby Hall, Pune', isActive: false, accessType: 'limited', grantedAt: '2025-12-01T10:00:00Z' }
];

export const demoFamilyMembers = [
    { _id: 'f1', name: 'Priya Sharma', healthId: 'HV-K8N2P5QL', bloodGroup: 'A+', age: 26, healthScore: 780 },
    { _id: 'f2', name: 'Ramesh Sharma', healthId: 'HV-R3M7X1PL', bloodGroup: 'O+', age: 58, healthScore: 620 }
];

export const demoInsights = [
    { id: 1, type: 'positive', title: 'Blood Pressure Trend', message: 'Your BP has been consistently normal for the last 3 months. Great job!' },
    { id: 2, type: 'warning', title: 'Cholesterol Watch', message: 'Total cholesterol is at 195 mg/dL. Consider reducing saturated fat intake.' },
    { id: 3, type: 'positive', title: 'Medication Adherence', message: 'You have maintained 95% adherence to your Montelukast schedule.' },
    { id: 4, type: 'info', title: 'Upcoming Vaccination', message: 'Your annual flu shot is due next month. Schedule with your physician.' }
];

export const demoHealthTrends = [
    { month: 'Nov', bp_sys: 128, bp_dia: 84, sugar: 105, cholesterol: 210 },
    { month: 'Dec', bp_sys: 125, bp_dia: 82, sugar: 102, cholesterol: 205 },
    { month: 'Jan', bp_sys: 122, bp_dia: 80, sugar: 100, cholesterol: 200 },
    { month: 'Feb', bp_sys: 120, bp_dia: 79, sugar: 99, cholesterol: 198 },
    { month: 'Mar', bp_sys: 120, bp_dia: 78, sugar: 98, cholesterol: 195 },
    { month: 'Apr', bp_sys: 118, bp_dia: 77, sugar: 96, cholesterol: 192 }
];
