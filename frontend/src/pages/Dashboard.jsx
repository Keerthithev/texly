import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardRoutes from '../routes/DashboardRoutes.jsx';
import { logout, getProfile } from '../services/auth';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
};

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState({ name: '', email: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { path: '/dashboard/sms', label: 'Send SMS', labelSi: 'SMS යවන්න', icon: '📱' },
    { path: '/dashboard/contacts', label: 'Contacts', labelSi: 'සම්බන්ධතා', icon: '👥' },
    { path: '/dashboard/templates', label: 'Templates', labelSi: 'ආකෘති', icon: '📝' },
    { path: '/dashboard/reports', label: 'Reports', labelSi: 'වාර්තා', icon: '📊' },
    { path: '/dashboard/subscription', label: 'Subscription', labelSi: 'දායකත්වය', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:transition-none`}>
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-primary">Texly</Link>
        </div>
        <nav className="px-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-background hover:text-primary'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.labelSi}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mr-4 p-2 text-primary hover:bg-gray-100 rounded">
                ☰
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                Dashboard
                <br />
                <span className="text-base md:text-lg text-secondary">උපකරණ පුවරුව</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted">Welcome back</p>
                <p className="font-semibold text-primary">{user.name}</p>
              </div>
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity">
                  {getInitials(user.name)}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <DashboardRoutes />
        </main>
      </div>
    </div>
  );
}
