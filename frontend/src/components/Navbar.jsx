import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUsers, FiLogOut, FiSearch, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const role = user?.role;

  const patientNavItems = [
    { path: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/records', icon: <FiShield />, label: 'Vault' },
    { path: '/medicines', icon: '💊', label: 'Medicines' },
    { path: '/family', icon: <FiUsers />, label: 'Family' },
    { path: '/access', icon: <FiShield />, label: 'Access' },
  ];


  const doctorNavItems = [
    { path: '/dashboard', icon: '👨‍⚕️', label: 'My Patients' },
  ];


  const hospitalNavItems = [
    { path: '/dashboard', icon: '🏥', label: 'Portal' },
  ];


  const navItems = role === 'doctor' ? doctorNavItems
    : role === 'hospital' ? hospitalNavItems
    : patientNavItems;

  const searchPlaceholder = role === 'doctor' ? 'Search patients...'
    : role === 'hospital' ? 'Search patients...'
    : 'Search records, doctors, insights...';

  const roleCode = role === 'doctor' ? user?.doctorCode
    : role === 'hospital' ? user?.labCode
    : null;

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact Us' },
  ];


  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💚</span>
          <span className="logo-text">HealthVault</span>
        </Link>


        {user && (
          <div className="navbar-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder={searchPlaceholder} />
          </div>
        )}


        <div className="navbar-links">
          {user ? (
            navItems.map(item => (
              <Link key={item.path} to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
                {typeof item.icon === 'string' ? <span>{item.icon}</span> : item.icon}
                <span>{item.label}</span>
              </Link>
            ))
          ) : (
            publicNavItems.map(item => (
              <Link key={item.path} to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
                <span>{item.label}</span>
              </Link>
            ))
          )}
        </div>


        <div className="navbar-profile">
          {user ? (
            <>
              {roleCode && (
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700, marginRight: 8 }}>
                  {roleCode}
                </span>
              )}
              <div className="profile-avatar" onClick={() => navigate('/dashboard')}>{user?.name?.charAt(0) || 'U'}</div>
              <button className="logout-btn" onClick={handleLogout} title="Logout"><FiLogOut /></button>
            </>
          ) : (
            <Link to="/login" className="login-nav-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
