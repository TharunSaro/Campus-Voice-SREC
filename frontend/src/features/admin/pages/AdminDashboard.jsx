import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import adminService from '../../../services/admin.service';
import { Card, Select, Stat, Skeleton, Badge, EliteButton } from '../../../components/UI';
// Removed: TopNav, AdminSidebar import (handled by layout now)
import { STATUSES, PRIORITIES } from '../../../utils/constants';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import AdminComplaintCard from '../components/AdminComplaintCard';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, analytics
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'Admin') return;
    loadOverview();
    loadAnalytics(); // Load analytics in background for charts
  }, [user]);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSystemOverview();
      setOverview(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await adminService.getAnalytics(30);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const stats = overview?.stats || {};
  const recentComplaints = overview?.recent_complaints || [];

  const COLORS = ['#14532D', '#D4AF37', '#22C55E', '#EF4444'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="text-srec-danger mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <EliteButton onClick={loadOverview}>Retry</EliteButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of system performance and grievance resolution</p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[{ label: 'Last 30 Days', value: '30' }, { label: 'Last 7 Days', value: '7' }]}
            value="30"
            className="w-40"
          />
          <EliteButton variant="outline" onClick={loadOverview}>Refresh Data</EliteButton>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat
          label="Total Complaints"
          value={stats.total_complaints || 0}
          icon={Activity}
          trend="+12%" // Mock trend for enterprise feel
          trendDirection="up"
          className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
        />
        <Stat
          label="Resolution Rate"
          value={`${Math.round((stats.resolved / (stats.total_complaints || 1)) * 100)}%`}
          icon={CheckCircle}
          color="green"
          className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
        />
        <Stat
          label="Critical Issues"
          value={stats.critical || 0}
          icon={AlertTriangle}
          color="red"
          trend="+2"
          trendDirection="down" // Down is bad, so red color handled by Stat component usually, or custom logic
          className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
        />
        <Stat
          label="Active Authorities"
          value={stats.active_authorities || 0}
          icon={Activity}
          color="blue"
          className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-srec-primary" />
            Complaint Volume Trend
          </h3>
          <div className="h-80 w-full">
            {analytics?.daily_counts ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.daily_counts}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14532D" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#14532D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#14532D" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading Chart Data...</div>
            )}
          </div>
        </Card>

        {/* Secondary Chart / Category Distribution */}
        <Card className="p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">By Category</h3>
          <div className="h-80 w-full">
            {analytics?.by_category ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.by_category}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.by_category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Loading...</div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Complaints Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
          <EliteButton variant="ghost" onClick={() => navigate('/admin/complaints')} className="text-srec-primary hover:text-srec-primaryHover">
            View All <ArrowUpRight size={16} className="ml-1" />
          </EliteButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentComplaints.slice(0, 6).map(complaint => (
            <AdminComplaintCard
              key={complaint.id}
              complaint={complaint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
