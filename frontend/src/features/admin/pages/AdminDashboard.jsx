import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Select, Stat, Skeleton, Badge, Button } from '../../../components/UI';
import { TopNav, AdminSidebar } from '../../../components/Navbars';

const categories = ['All', 'Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];
const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Escalated'];
const priorities = ['All', 'Low', 'Medium', 'High'];

const dummyComplaints = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  title: `Complaint #${i + 1} - Issue Description`,
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
    <div className="min-h-screen bg-background">
      <TopNav />
      <AdminSidebar>
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and track student grievances.</p>
            </div>
            {/* <Button variant="outline" onClick={logout} className="text-sm">Logout</Button> */}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Stat label="Total Complaints" value={totals.total} className="bg-surface shadow-neu-flat" />
            <Stat label="Resolved" value={totals.resolved} color="green" className="bg-surface shadow-neu-flat" />
            <Stat label="Pending" value={totals.pending} color="amber" className="bg-surface shadow-neu-flat" />
            <Stat label="Escalated" value={totals.escalated} color="red" className="bg-surface shadow-neu-flat" />
          </div>

          <Card className="p-5 mb-8 shadow-neu-flat">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <Select
                  value={filters.category}
                  onChange={(v) => setFilters({ ...filters, category: v })}
                  options={categories.map((c) => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
                  className="w-full lg:w-48"
                />
                <Select
                  value={filters.priority}
                  onChange={(v) => setFilters({ ...filters, priority: v })}
                  options={priorities.map((p) => ({ value: p, label: p === 'All' ? 'All Priorities' : p }))}
                  className="w-full lg:w-40"
                />
                <Select
                  value={filters.status}
                  onChange={(v) => setFilters({ ...filters, status: v })}
                  options={statuses.map((s) => ({ value: s, label: s === 'All' ? 'All Statuses' : s }))}
                  className="w-full lg:w-40"
                />
              </div>
              <Button
                onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
                className="w-full lg:w-auto shadow-lg shadow-brand/20"
              >
                Refresh Data
              </Button>
            </div>
          </Card>

          <div className="bg-surface rounded-xl shadow-neu-flat border border-white/60 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Age</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 line-clamp-1">{row.title}</span>
                          <span className="text-xs text-gray-400">ID: #{row.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${row.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                            row.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge type={row.status}>{row.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-500 tabular-nums">
                          {Math.ceil((Date.now() - new Date(row.createdAt).getTime()) / 3600000)}h
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-brand hover:text-brand-dark font-medium text-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {!loading && filtered.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No complaints found matching filters.
              </div>
            )}
          </div>
        </div>
      </AdminSidebar>
    </div>
  );
}

