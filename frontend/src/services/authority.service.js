import { api } from '../utils/api';

// Authority Profile
const getProfile = async () => {
    return await api('/authorities/profile');
};

// Authority Dashboard
const getDashboard = async () => {
    console.log('📡 API Call: GET /authorities/dashboard');
    const response = await api('/authorities/dashboard');
    console.log('📡 Response:', response);
    return response;
};

// Get assigned complaints
const getMyComplaints = async (skip = 0, limit = 20, status_filter = null) => {
    const params = new URLSearchParams({ skip, limit });
    if (status_filter) params.append('status_filter', status_filter);
    const url = `/authorities/my-complaints?${params}`;
    console.log('📡 API Call: GET', url);
    const response = await api(url);
    console.log('📡 Response:', response);
    return response;
};

// Get specific complaint details
const getComplaintDetails = async (complaintId) => {
    return await api(`/authorities/complaints/${complaintId}`);
};

// Update complaint status
const updateComplaintStatus = async (complaintId, status, reason = null) => {
    return await api(`/authorities/complaints/${complaintId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
    });
};

// Post update on complaint
const postUpdate = async (complaintId, title, content) => {
    const params = new URLSearchParams({ title, content });
    return await api(`/authorities/complaints/${complaintId}/post-update?${params}`, {
        method: 'POST',
    });
};

// Escalate complaint
const escalateComplaint = async (complaintId, reason) => {
    const params = new URLSearchParams({ reason });
    return await api(`/authorities/complaints/${complaintId}/escalate?${params}`, {
        method: 'POST',
    });
};

// Get escalation history
const getEscalationHistory = async (complaintId) => {
    return await api(`/authorities/complaints/${complaintId}/escalation-history`);
};

// Flag as spam
const flagSpam = async (complaintId, reason) => {
    const params = new URLSearchParams({ reason });
    return await api(`/complaints/${complaintId}/flag-spam?${params}`, {
        method: 'POST',
    });
};

// Remove spam flag
const unflagSpam = async (complaintId) => {
    return await api(`/complaints/${complaintId}/unflag-spam`, {
        method: 'POST',
    });
};

// Get stats
const getStats = async () => {
    return await api('/authorities/stats');
};

const authorityService = {
    getProfile,
    getDashboard,
    getMyComplaints,
    getComplaintDetails,
    updateComplaintStatus,
    postUpdate,
    escalateComplaint,
    getEscalationHistory,
    flagSpam,
    unflagSpam,
    getStats,
};

export default authorityService;
