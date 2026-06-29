import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaSignOutAlt, FaPalette, FaBullhorn, FaLaptopCode, FaChartLine, FaUsers, FaStar, FaEnvelope } from 'react-icons/fa';
import { HiPhotograph, HiColorSwatch, HiTemplate, HiOfficeBuilding } from 'react-icons/hi';

const stats = [
  { icon: FaPalette, label: 'Design Requests', value: '12', color: 'from-purple-600 to-purple-400' },
  { icon: FaUsers, label: 'Total Clients', value: '34', color: 'from-blue-600 to-blue-400' },
  { icon: FaStar, label: 'Completed Projects', value: '48', color: 'from-amber-600 to-amber-400' },
  { icon: FaEnvelope, label: 'New Messages', value: '7', color: 'from-emerald-600 to-emerald-400' },
];

const recentRequests = [
  { id: 1, client: 'John Adeyemi', service: 'Logo Design', date: '2026-06-25', status: 'Pending' },
  { id: 2, client: 'Grace Okonkwo', service: 'Brand Identity', date: '2026-06-24', status: 'In Progress' },
  { id: 3, client: 'David Okafor', service: 'Signage Design', date: '2026-06-23', status: 'Completed' },
];

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.email !== 'winnermichael@gmail.com') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  if (!currentUser || currentUser.email !== 'winnermichael@gmail.com') {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-purple-200/80">
                Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/20 cursor-pointer"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:shadow-lg transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="text-white text-lg" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-[var(--text-secondary)]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Design Requests</h2>
                <span className="text-xs text-[var(--text-secondary)]">Last 7 days</span>
              </div>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                        {request.client.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{request.client}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{request.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        request.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                        request.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      }`}>
                        {request.status}
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: FaPalette, label: 'Review Designs', desc: '2 pending reviews' },
                  { icon: FaEnvelope, label: 'Messages', desc: '7 unread messages' },
                  { icon: FaUsers, label: 'Manage Clients', desc: 'View client list' },
                  { icon: FaChartLine, label: 'Analytics', desc: 'View site stats' },
                ].map(({ icon: Icon, label, desc }) => (
                  <button key={label} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200 text-left cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Icon className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}