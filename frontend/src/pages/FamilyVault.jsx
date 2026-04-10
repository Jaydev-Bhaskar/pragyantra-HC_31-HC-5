import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { demoFamilyMembers, isDemoUser } from '../utils/demoData';
import API from '../utils/api';
import { FiPlus, FiActivity, FiHeart } from 'react-icons/fi';
import './Pages.css';

const FamilyVault = () => {
  const { user } = useAuth();
  const isDemo = isDemoUser(user);
  const [members, setMembers] = useState(isDemo ? demoFamilyMembers : []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', bloodGroup: '', age: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isDemo) fetchFamily();
  }, [isDemo]);

  const fetchFamily = async () => {
    try {
      const { data } = await API.get('/auth/family');
      setMembers(data || []);
    } catch { /* empty for new users */ }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.post('/auth/family', form);
      setMembers(prev => [...prev, data]);
    } catch {
      const local = { _id: 'fam_' + Date.now(), ...form, healthId: 'HV-' + Math.random().toString(36).substring(2, 8).toUpperCase(), healthScore: 500 };
      setMembers(prev => [...prev, local]);
    }
    setForm({ name: '', bloodGroup: '', age: '' });
    setShowForm(false);
    setSaving(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>👨‍👩‍👧‍👦 Family Vault</h1>
          <p className="text-muted">Manage health records of your family members</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> Add Member</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px' }}>Add Family Member</h4>
          <form onSubmit={handleAdd} className="inline-form">
            <div className="form-group"><label>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
            </div>
            <div className="form-group"><label>Blood Group</label>
              <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Age</label>
              <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" min={0} max={120} />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add'}</button>
          </form>
        </div>
      )}

      {/* Empty state */}
      {members.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h3>👨‍👩‍👧‍👦 No Family Members</h3>
          <p className="text-muted" style={{ margin: '12px 0 20px' }}>Add family members to manage their health records from your dashboard.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}><FiPlus /> Add First Member</button>
        </div>
      )}

      <div className="family-grid">
        {members.map(member => (
          <div key={member._id} className="card family-card">
            <div className="family-avatar">
              <span style={{ fontSize: '1.5rem', color: 'white' }}>{member.name?.charAt(0)}</span>
            </div>
            <h3>{member.name}</h3>
            <p className="text-muted">{member.healthId || '—'}</p>
            <div className="family-stats">
              <div className="family-stat"><FiHeart size={14} color="var(--secondary)" /> {member.bloodGroup || '—'}</div>
              <div className="family-stat">Age: {member.age || '—'}</div>
            </div>
            <div className="family-score">
              <FiActivity size={16} color="#2e7d32" />
              <strong>{member.healthScore || 500}</strong>
              <span className="text-muted">/1000</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyVault;
