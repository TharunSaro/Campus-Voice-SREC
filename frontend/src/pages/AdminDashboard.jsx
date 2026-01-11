import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Select, Stat, Skeleton, Badge } from '../components/UI';
import { TopNav, AdminSidebar } from '../components/Navbars';

const categories = ['All', 'Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];
const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Escalated'];
const priorities = ['All', 'Low', 'Medium', 'High'];

const dummyComplaints = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  title: `Complaint #${i + 1}`,
  category: categories[(i % (categories.length - 1)) + 1],
  priority: ['Low', 'Medium', 'High'][i % 3],
  status: statuses[(i % (statuses.length - 1)) + 1],
  createdAt: new Date(Date.now() - (i + 2) * 3600_000).toISOString(),
}));

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [filters, setFilters] = useState({ category: 'All', priority: 'All', status: 'All' });
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return dummyComplaints.filter((c) =>
      (filters.category === 'All' || c.category === filters.category) &&
      (filters.priority === 'All' || c.priority === filters.priority) &&
      (filters.status === 'All' || c.status === filters.status)
    );
  }, [filters]);

  const totals = useMemo(() => {
    const total = dummyComplaints.length;
    const resolved = dummyComplaints.filter((c) => c.status === 'Resolved').length;
    const escalated = dummyComplaints.filter((c) => c.status === 'Escalated').length;
    const pending = total - resolved;
    return { total, resolved, pending, escalated };
  }, []);

  return (
    <div className="min-h-screen">
      <TopNav />
      <AdminSidebar>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={totals.total} />
        <Stat label="Resolved" value={totals.resolved} color="green" />
        <Stat label="Pending" value={totals.pending} color="amber" />
        <Stat label="Escalated" value={totals.escalated} color="red" />
      </div>

      <Card className="p-4 mt-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Select value={filters.category} onChange={(v) => setFilters({ ...filters, category: v })}
              options={categories.map((c) => ({ value: c, label: c }))} />
            <Select value={filters.priority} onChange={(v) => setFilters({ ...filters, priority: v })}
              options={priorities.map((p) => ({ value: p, label: p }))} />
            <Select value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })}
              options={statuses.map((s) => ({ value: s, label: s }))} />
          </div>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }} className="bg-brand hover:bg-brand-dark text-white rounded-lg px-3 py-2 text-sm">Refresh</button>
        </div>
      </Card>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <Card className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-gray-500">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Age</div>
            </div>
            {filtered.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                <div className="col-span-12 sm:col-span-5 text-sm text-gray-900">{row.title}</div>
                <div className="col-span-6 sm:col-span-2"><Badge>{row.category}</Badge></div>
                <div className="col-span-3 sm:col-span-2"><span className="text-xs px-2 py-1 rounded bg-gray-100">{row.priority}</span></div>
                <div className="col-span-3 sm:col-span-2"><span className="text-xs px-2 py-1 rounded bg-gray-100">{row.status}</span></div>
                <div className="col-span-12 sm:col-span-1 text-right text-xs text-gray-500">{Math.ceil((Date.now() - new Date(row.createdAt).getTime()) / 3600000)}h</div>
              </div>
            ))}
          </Card>
        )}
      </div>
      </div>
      </AdminSidebar>
    </div>
  );
}

