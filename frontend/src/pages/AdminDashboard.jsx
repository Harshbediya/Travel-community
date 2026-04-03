import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  MessageSquare, 
  Map, 
  Activity, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Server,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [realtimeLogins, setRealtimeLogins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    const ws = new WebSocket('ws://localhost:8000/ws/admin_dashboard/');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      setRealtimeLogins((prevLogins) => [data, ...prevLogins].slice(0, 5)); // Show latest 5
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await axiosInstance.get('/api/admin-dashboard/stats/');
      setStats(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      Toast.error("Failed to load dashboard data");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin-dashboard/users/');
      setUsers(response.data);
    } catch (err) {
      Toast.error("Failed to load users");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/api/admin-dashboard/bookings/');
      setBookings(response.data);
    } catch (err) {
      Toast.error("Failed to load bookings");
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axiosInstance.get('/api/admin-dashboard/logs/');
      setLogs(response.data);
    } catch (err) {
      Toast.error("Failed to load audit logs");
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="pt-32 flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white dark:bg-navy-light p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-navy dark:text-white">{value}</p>
    </div>
  );

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-widest text-[10px] mb-4">
            <Shield className="w-3 h-3" />
            Admin Console
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-navy dark:text-white tracking-tight flex items-center gap-4">
            System Monitoring
            <button 
              onClick={fetchDashboardData}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-light transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </h1>
          <p className="text-gray-400 font-bold mt-2">Welcome back, Admin. Real-time insights and security management.</p>
        </div>
        
        <div className="flex flex-wrap bg-gray-50 dark:bg-navy-light p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          {['overview', 'users', 'bookings', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab 
                ? 'bg-white dark:bg-navy shadow-md text-primary' 
                : 'text-gray-400 hover:text-navy dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.metrics.total_users} 
                icon={Users} 
                trend={12} 
                color="bg-blue-500" 
              />
              <StatCard 
                title="Total Bookings" 
                value={stats.metrics.total_bookings} 
                icon={ShoppingBag} 
                trend={8} 
                color="bg-primary" 
              />
              <StatCard 
                title="Revenue" 
                value={`₹${stats.metrics.total_revenue.toLocaleString()}`} 
                icon={IndianRupee} 
                trend={15} 
                color="bg-green-500" 
              />
              <StatCard 
                title="System Health" 
                value="99.9%" 
                icon={Activity} 
                trend={0.1} 
                color="bg-purple-500" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-black text-navy dark:text-white flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      Recent Transactions
                    </h3>
                    <button className="text-primary font-bold text-sm hover:underline" onClick={() => setActiveTab('bookings')}>View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-navy text-left">
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {stats.recent_bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-navy transition-colors">
                            <td className="px-8 py-5">
                              <span className="font-bold text-navy dark:text-white">{booking.user}</span>
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-500">{booking.destination}</td>
                            <td className="px-8 py-5 font-black text-navy dark:text-white">₹{booking.total_price}</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                booking.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* New: Recent Audit Logs Snippet */}
                <div className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-black text-navy dark:text-white flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-purple-500" />
                      Security Audit Logs
                    </h3>
                    <button className="text-primary font-bold text-sm hover:underline" onClick={() => setActiveTab('logs')}>View Detailed Logs</button>
                  </div>
                  <div className="p-4 space-y-3">
                    {stats.audit_logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            log.action === 'LOGIN' ? 'bg-green-100 text-green-600' : 
                            log.action === 'SECURITY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-navy dark:text-white">{log.description}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{log.user} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 bg-white dark:bg-navy-light px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800">
                          {log.ip_address}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: System Health */}
              <div className="space-y-8">
                <div className="bg-navy dark:bg-primary p-8 rounded-[40px] text-white shadow-xl shadow-navy/20 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-4">Security Status</h3>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-lg">System Secure</p>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Encryption: AES-256 Active</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Firewall</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-green-400 h-full w-[95%]"></div>
                      </div>
                    </div>
                    <button className="w-full bg-white text-navy py-3 rounded-xl font-black text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                      <Server className="w-4 h-4" />
                      Security Audit
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white dark:bg-navy-light p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h3 className="text-xl font-black text-navy dark:text-white mb-6 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-500" />
                    Infrastructure
                  </h3>
                  <div className="space-y-6">
                    {stats.system_health.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-600 dark:text-gray-300 text-sm">{item.name}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${item.value > 80 ? 'text-red-500' : 'text-green-500'}`}>
                            {item.value.toFixed(1)}{item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-navy h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${item.value > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
                      {[
                        { label: 'API Gateway', status: 'Healthy' },
                        { label: 'DB Cluster', status: 'Optimized' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center mt-3">
                          <span className="text-xs font-bold text-gray-400">{s.label}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* New: Real-time Login Events */}
              <div className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-black text-navy dark:text-white flex items-center gap-3">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Real-time Login Events
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {realtimeLogins.length > 0 ? (
                    realtimeLogins.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-green-100 text-green-600">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-navy dark:text-white">{event.username} logged in</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">
                              {new Date(event.timestamp).toLocaleString()} • {event.device_info}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 bg-white dark:bg-navy-light px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800">
                          {event.ip_address}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 text-sm py-4">No real-time login events yet.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-navy dark:text-white flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                User Management
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-navy border-none rounded-2xl text-sm font-bold w-full md:w-72 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy text-left">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-navy transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-bold text-navy dark:text-white">{u.username}</span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          u.is_staff ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.is_staff ? 'Admin' : 'Traveler'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td className="px-8 py-5">
                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{u.is_active ? 'Active' : 'Suspended'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded-xl transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-navy dark:text-white flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Booking Registry
              </h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Reference ID..." 
                    className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-navy border-none rounded-2xl text-sm font-bold w-full md:w-60 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button className="p-3 bg-gray-50 dark:bg-navy rounded-2xl text-gray-400 hover:text-primary transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy text-left">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref ID</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-navy transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs font-black text-primary">{b.reference || 'REF-'+b.id.toString().substring(0,6)}</span>
                      </td>
                      <td className="px-8 py-5 font-bold text-navy dark:text-white">{b.user}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{b.destination}</td>
                      <td className="px-8 py-5 font-black text-navy dark:text-white">₹{b.total_price}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          b.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-navy-light rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-navy dark:text-white flex items-center gap-3">
                <Terminal className="w-6 h-6 text-purple-500" />
                Audit Trail
              </h3>
              <div className="flex gap-3">
                <select className="px-4 py-2 bg-gray-50 dark:bg-navy border-none rounded-xl text-xs font-bold text-gray-500 outline-none">
                  <option>All Actions</option>
                  <option>Login</option>
                  <option>Security</option>
                  <option>System</option>
                </select>
                <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-colors">
                  Export Logs
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy text-left">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actor</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-navy transition-colors">
                      <td className="px-8 py-5 text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-8 py-5 font-bold text-navy dark:text-white">{log.user}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          log.action === 'LOGIN' ? 'bg-green-100 text-green-600' : 
                          log.action === 'SECURITY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs text-gray-400">{log.ip_address}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
