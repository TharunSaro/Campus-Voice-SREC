import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authorityService from '../../../services/authority.service';
import { Card, EliteButton, Select } from '../../../components/UI';
import StatsCard from '../../../components/UI/StatsCard'; // Import StatsCard
import AuthoritySidebar from '../components/AuthoritySidebar';
import AuthorityHeader from '../components/AuthorityHeader';
import AuthorityComplaintCard from '../components/AuthorityComplaintCard';
import { STATUSES } from '../../../utils/constants';
import { format } from 'date-fns';
import { LayoutDashboard, CheckCircle, Clock, AlertCircle } from 'lucide-react'; // Icons for Stats

export default function AuthorityDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [error, setError] = useState(null);

    const [spamModalOpen, setSpamModalOpen] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [spamReason, setSpamReason] = useState('');
    const [spamSubmitting, setSpamSubmitting] = useState(false);

    useEffect(() => {
        console.log('🔐 Current user:', user);
        console.log('🔐 Token:', localStorage.getItem('token'));

        if (!user) {
            console.warn('⚠️ No user found, redirecting to login...');
            navigate('/authority-login');
            return;
        }

        if (user.role !== 'Authority' && user.role !== 'Admin') {
            console.warn('⚠️ User is not an authority or admin:', user.role);
            setError('You do not have permission to access this dashboard');
            return;
        }

        loadDashboard();
    }, []);

    useEffect(() => {
        if (dashboard) {
            loadComplaints();
        }
    }, [statusFilter]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Fetching authority dashboard...');
            const data = await authorityService.getDashboard();
            console.log('✅ Dashboard data received:', data);
            setDashboard(data);
            await loadComplaints();
        } catch (err) {
            console.error('❌ Failed to load dashboard:', err);
            setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const loadComplaints = async () => {
        try {
            const filter = statusFilter === 'All' ? null : statusFilter;
            console.log('🔄 Fetching complaints with filter:', filter);
            const data = await authorityService.getMyComplaints(0, 20, filter);
            console.log('📊 Complaints response:', data);

            // Handle different response formats
            let complaintsList = [];
            if (Array.isArray(data)) {
                complaintsList = data;
            } else if (data.complaints && Array.isArray(data.complaints)) {
                complaintsList = data.complaints;
            } else if (data.data && Array.isArray(data.data)) {
                complaintsList = data.data;
            }

            console.log('✅ Setting complaints:', complaintsList.length, 'items');
            setComplaints(complaintsList);
        } catch (err) {
            console.error('❌ Failed to load complaints:', err);
            setComplaints([]);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await authorityService.updateComplaintStatus(complaintId, newStatus);
            await loadComplaints();
            await loadDashboard(); // Refresh stats
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    };

    const openSpamModal = (e, complaintId) => {
        e.stopPropagation();
        setSelectedComplaintId(complaintId);
        setSpamReason('');
        setSpamModalOpen(true);
    };

    const handleFlagSpam = async () => {
        if (!spamReason.trim()) {
            alert('Please provide a reason for flagging as spam.');
            return;
        }

        try {
            setSpamSubmitting(true);
            await authorityService.flagSpam(selectedComplaintId, spamReason);
            setSpamModalOpen(false);
            await loadComplaints();
            await loadDashboard(); // Refresh stats
            alert('Complaint flagged as spam successfully');
        } catch (err) {
            alert('Failed to flag as spam: ' + err.message);
        } finally {
            setSpamSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-srec-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-srec-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-srec-background flex items-center justify-center">
                <Card className="p-8 max-w-md shadow-lg border-red-100">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto text-srec-danger">
                        <AlertCircle size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-red-900 mb-2 text-center">Access Denied</h2>
                    <p className="text-gray-600 mb-6 text-center">{error}</p>
                    <EliteButton onClick={loadDashboard} className="w-full justify-center">Retry Connection</EliteButton>
                </Card>
            </div>
        );
    }

    const stats = dashboard?.stats || {};

    return (
        <div className="flex min-h-screen bg-srec-background">
            <AuthoritySidebar className="hidden md:flex fixed inset-y-0 left-0 z-10" />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0 transition-all duration-300">
                <AuthorityHeader />

                <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <StatsCard
                            label="Total Assigned"
                            value={stats.total_assigned || 0}
                            icon={LayoutDashboard}
                            color="blue"
                        />
                        <StatsCard
                            label="In Progress"
                            value={stats.in_progress || 0}
                            icon={Clock}
                            color="yellow"
                        />
                        <StatsCard
                            label="Resolved"
                            value={stats.resolved || 0}
                            icon={CheckCircle}
                            color="green"
                        />
                        <StatsCard
                            label="Pending"
                            value={stats.pending || 0}
                            icon={AlertCircle}
                            color="red"
                        />
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Assigned Complaints</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-medium">Filter by:</span>
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'All', label: 'All Statuses' },
                                    ...STATUSES.map(s => ({ value: s, label: s }))
                                ]}
                                className="w-48 bg-white border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Complaints List */}
                    {complaints.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 mx-auto text-gray-400">
                                <LayoutDashboard size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No complaints found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                {statusFilter !== 'All'
                                    ? `There are no complaints with status "${statusFilter}" currently assigned to you.`
                                    : 'You have no complaints assigned at the moment. Good job!'}
                            </p>
                            <EliteButton
                                variant="outline"
                                onClick={loadDashboard}
                            >
                                Refresh Dashboard
                            </EliteButton>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map(complaint => (
                                <AuthorityComplaintCard
                                    key={complaint.id}
                                    complaint={complaint}
                                    onStatusUpdate={handleStatusUpdate}
                                    onFlagSpam={openSpamModal}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Spam Reason Modal */}
            {spamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6 bg-white shadow-xl border-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Flag as Spam</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Please provide a reason. This will hide the complaint and notify the student.
                        </p>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-srec-danger focus:border-transparent outline-none mb-6 resize-none bg-gray-50 focus:bg-white transition-colors"
                            rows={3}
                            placeholder="Reason for flagging (e.g., promotional content...)"
                            value={spamReason}
                            onChange={(e) => setSpamReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <EliteButton
                                variant="ghost"
                                onClick={() => setSpamModalOpen(false)}
                                disabled={spamSubmitting}
                            >
                                Cancel
                            </EliteButton>
                            <EliteButton
                                variant="danger"
                                onClick={handleFlagSpam}
                                disabled={spamSubmitting}
                                isLoading={spamSubmitting}
                            >
                                {spamSubmitting ? 'Flagging...' : 'Confirm Spam'}
                            </EliteButton>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
