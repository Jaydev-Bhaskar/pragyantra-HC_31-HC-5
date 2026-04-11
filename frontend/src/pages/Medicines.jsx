import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { isDemoUser } from '../utils/demoData';
import { FiPlus, FiClock, FiCheck, FiAlertCircle, FiBell, FiTrash2, FiCalendar, FiMinus } from 'react-icons/fi';
import API from '../utils/api';
import './Pages.css';

const demoMedicines = [
  { _id: 'm1', name: 'Montelukast', dosage: '10mg', frequency: 'once_daily', timings: ['09:00 PM'], isActive: true, prescribedBy: 'Dr. Rohit Sharma', notes: 'For asthma', startDate: '2026-01-15', refillDate: '2026-04-20', adherenceLog: [], sideEffects: ['Headache'] },
  { _id: 'm2', name: 'Cetirizine', dosage: '5mg', frequency: 'once_daily', timings: ['10:00 AM'], isActive: true, prescribedBy: 'Dr. Rohit Sharma', notes: 'As needed for allergies', startDate: '2026-03-28', refillDate: null, adherenceLog: [], sideEffects: [] },
  { _id: 'm3', name: 'Vitamin D3', dosage: '60000 IU', frequency: 'weekly', timings: ['After Breakfast'], isActive: true, prescribedBy: 'Dr. Priya Desai', notes: 'Weekly supplement', startDate: '2026-02-01', refillDate: '2026-04-15', adherenceLog: [], sideEffects: [] },
];

const EMPTY_MED = { name: '', dosage: '', frequency: 'once_daily', timings: ['09:00 AM'] };

const Medicines = () => {
  const { user } = useAuth();
  const isDemo = isDemoUser(user);
  const [medicines, setMedicines] = useState(isDemo ? demoMedicines : []);
  const [takenMap, setTakenMap] = useState({});

  useEffect(() => {
    if (!isDemo) fetchMedicines();

    const handleMedicineTaken = (e) => {
      const { medId, timing } = e.detail;
      const key = `${medId}_${timing}`;
      setTakenMap(prev => ({ ...prev, [key]: true }));
    };

    window.addEventListener('medicineTaken', handleMedicineTaken);
    return () => window.removeEventListener('medicineTaken', handleMedicineTaken);
  }, [isDemo]);


  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      setMedicines(data || []);
    } catch { /* empty for new users */ }
  };


  const markTaken = async (medId, timing) => {
    const key = `${medId}_${timing}`;
    setTakenMap(prev => ({ ...prev, [key]: true }));
    try { await API.post(`/medicines/${medId}/taken`, { timing }); } catch { /* marked locally */ }
  };

  const deleteMedicine = async (medId) => {
    setMedicines(prev => prev.filter(m => m._id !== medId));
    try { await API.delete(`/medicines/${medId}`); } catch { /* already removed */ }
  };

  const toggleActive = async (medId) => {
    setMedicines(prev => prev.map(m => m._id === medId ? { ...m, isActive: !m.isActive } : m));
    try {
      const med = medicines.find(m => m._id === medId);
      await API.put(`/medicines/${medId}`, { isActive: !med.isActive });
    } catch { /* toggled locally */ }
  };

  const freqLabels = { once_daily: 'Once Daily', twice_daily: 'Twice Daily', thrice_daily: '3x Daily', weekly: 'Weekly', as_needed: 'As Needed' };
  const timingOptions = ['06:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '06:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', 'After Breakfast', 'After Lunch', 'After Dinner', 'Before Bed'];

  const activeMeds = medicines.filter(m => m.isActive);
  const inactiveMeds = medicines.filter(m => !m.isActive);

  const needsRefill = medicines.filter(m => {
    if (!m.refillDate) return false;
    const diff = new Date(m.refillDate) - new Date();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>💊 Medicine Manager</h1>
          <p className="text-muted">Track your medications, never miss a dose</p>
        </div>
      </div>

      {/* Refill Alerts */}
      {needsRefill.length > 0 && (
        <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f57f17', marginBottom: '24px' }}>
          <div className="flex items-center gap-sm">
            <FiAlertCircle color="#f57f17" size={20} />
            <div>
              <strong style={{ color: '#f57f17' }}>Refill Reminder!</strong>
              <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                {needsRefill.map(m => m.name).join(', ')} — refill needed within 7 days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Reminders */}
      {activeMeds.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px' }}><FiBell size={16} /> Today's Schedule</h4>
          <div className="reminder-grid">
            {activeMeds.map(med => (
              <div key={med._id} className="reminder-slots">
                {(med.timings || ['09:00 AM']).map((timing, i) => {
                  const key = `${med._id}_${timing}`;
                  const isTaken = takenMap[key];
                  return (
                    <div key={i} className={`reminder-slot ${isTaken ? 'taken' : ''}`}>
                      <div className="slot-time"><FiClock size={12} /> {timing}</div>
                      <div className="slot-med">
                        <strong>{med.name}</strong>
                        <span>{med.dosage}</span>
                      </div>
                      <button className={isTaken ? 'btn-taken' : 'btn-take'} onClick={() => !isTaken && markTaken(med._id, timing)} disabled={isTaken}>
                        {isTaken ? <><FiCheck /> Taken</> : 'Mark Taken'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {medicines.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h3>💊 No Medicines Found</h3>
          <p className="text-muted" style={{ margin: '12px 0 20px' }}>
            When a doctor prescribes you medication, it will auto-import and appear here securely.
          </p>
        </div>
      )}

      {/* Active Medicines */}
      {activeMeds.length > 0 && (
        <>
          <h3 style={{ marginBottom: '16px' }}>Active Medications ({activeMeds.length})</h3>
          <div className="med-grid">
            {activeMeds.map(med => (
              <div key={med._id} className="card med-card">
                <div className="med-card-header">
                  <div>
                    <strong>{med.name}</strong>
                    <span className="chip" style={{ marginLeft: '8px' }}>{med.dosage}</span>
                  </div>
                  <div className={`toggle ${med.isActive ? 'active' : ''}`} onClick={() => toggleActive(med._id)}></div>
                </div>
                <div className="med-card-body">
                  <div className="med-detail"><FiClock size={12} /> {freqLabels[med.frequency] || med.frequency}</div>
                  <div className="med-detail"><FiBell size={12} /> {(med.timings || []).join(', ')}</div>
                  {med.prescribedBy && <div className="med-detail">👨‍⚕️ {med.prescribedBy}</div>}
                  {med.notes && <div className="med-detail" style={{ fontStyle: 'italic', color: 'var(--outline)' }}>📝 {med.notes}</div>}
                  {med.refillDate && (
                    <div className="med-detail" style={{ color: new Date(med.refillDate) < new Date(Date.now() + 7*24*60*60*1000) ? '#f57f17' : 'var(--outline)' }}>
                      <FiCalendar size={12} /> Refill: {new Date(med.refillDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    {(() => {
                      let daysCount = 7;
                      if (med.notes) {
                        const match = med.notes.match(/(\d+)\s*days?/i);
                        if (match) daysCount = parseInt(match[1]);
                      }
                      
                      const trackDays = [];
                      for (let i = daysCount - 1; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        trackDays.push(d.toISOString().split('T')[0]);
                      }

                      return (
                        <>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            {daysCount}-Day Adherence
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {trackDays.map((dateStr, idx) => {
                              const wasTakenSync = (med.adherenceLog || []).some(log => log.date.substring(0, 10) === dateStr && log.taken);
                              const isToday = dateStr === trackDays[trackDays.length - 1];
                              const wasTakenLocal = isToday && (med.timings || []).some(t => takenMap[`${med._id}_${t}`]);
                              const wasTaken = wasTakenSync || wasTakenLocal;
                              
                              return (
                                <div 
                                  key={dateStr} 
                                  title={dateStr}
                                  style={{
                                    flex: daysCount > 10 ? '0 0 calc(10% - 4px)' : 1, 
                                    height: '8px', 
                                    borderRadius: '4px',
                                    background: wasTaken ? '#4caf50' : '#e0e0e0'
                                  }} 
                                />
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <button className="btn-ghost" style={{ width: '100%', marginTop: '12px', fontSize: '0.8rem', color: 'var(--error)' }} onClick={() => deleteMedicine(med._id)}>
                  <FiTrash2 size={12} /> Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Inactive */}
      {inactiveMeds.length > 0 && (
        <>
          <h3 style={{ margin: '32px 0 16px', opacity: 0.6 }}>Past Medications ({inactiveMeds.length})</h3>
          <div className="med-grid">
            {inactiveMeds.map(med => (
              <div key={med._id} className="card med-card" style={{ opacity: 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong>{med.name}</strong> <span className="chip">{med.dosage}</span>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                      {freqLabels[med.frequency] || med.frequency} · {med.prescribedBy || 'Self'}
                    </p>
                  </div>
                  <button onClick={() => deleteMedicine(med._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} title="Delete Medicine">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Medicines;
