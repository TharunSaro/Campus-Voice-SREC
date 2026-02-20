import { api } from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campusvoice-api-h528.onrender.com/api';

const submitComplaint = async (formData) => {
    // FormData submission - do NOT set Content-Type header (browser sets it with boundary)
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/complaints/submit`;

    console.log('🚀 Submitting complaint to:', url);
    console.log('📝 FormData contents:');
    for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('❌ API Error:', error);
            throw new Error(error.error || error.message || `Submission failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Complaint submitted successfully:', data);
        return data;
    } catch (err) {
        console.error('💥 Network/Fetch Error:', err);
        throw err;
    }
};

const createComplaint = async (complaintData) => {
    return await api('/complaints', {
        method: 'POST',
        body: JSON.stringify(complaintData),
    });
};

const getMyComplaints = async (rollNumber, limit = 50, offset = 0) => {
    const params = new URLSearchParams({
        roll_number: rollNumber,
        limit,
        offset,
    });
    return await api(`/complaints/my?${params}`);
};

const getPublicFeed = async (skip = 0, limit = 20) => {
    const params = new URLSearchParams({ skip, limit });
    return await api(`/complaints/public-feed?${params}`);
};

const getPublicComplaints = async (limit = 20, offset = 0, status_filter, priority_filter) => {
    const query = { limit, offset };
    if (status_filter) query.status_filter = status_filter;
    if (priority_filter) query.priority_filter = priority_filter;

    const params = new URLSearchParams(query);
    return await api(`/complaints/public?${params}`);
};

const getComplaintDetails = async (id) => {
    return await api(`/complaints/${id}`);
};


const voteOnComplaint = async (complaintId, voteType) => {
    return await api(`/complaints/${complaintId}/vote`, {
        method: 'POST',
        body: JSON.stringify({
            vote_type: voteType
        }),
    });
};

const removeVote = async (complaintId) => {
    return await api(`/complaints/${complaintId}/vote`, {
        method: 'DELETE',
    });
};

const getMyVote = async (complaintId) => {
    return await api(`/complaints/${complaintId}/my-vote`);
};


const uploadImage = async (complaintId, imageFile) => {
    const fd = new FormData();
    fd.append('file', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/upload-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: fd
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'Failed to upload image');
    }

    return await response.json();
};

const fetchImage = async (complaintId, thumbnail = false) => {
    const token = localStorage.getItem('token');
    const url = thumbnail
        ? `${API_BASE_URL}/complaints/${complaintId}/image?thumbnail=true`
        : `${API_BASE_URL}/complaints/${complaintId}/image`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

const verifyImage = async (complaintId) => {
    return await api(`/complaints/${complaintId}/verify-image`, {
        method: 'POST'
    });
};


const getComplaintStatusHistory = async (id) => {
    return await api(`/complaints/${id}/status-history`);
};

const getComplaintTimeline = async (id) => {
    return await api(`/complaints/${id}/timeline`);
};

const getAdvancedFilteredComplaints = async (filters) => {
    // Clear out null/empty filters
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    return await api(`/complaints/filter/advanced?${params}`);
};

const complaintService = {
    submitComplaint,
    createComplaint,
    getMyComplaints,
    getPublicFeed,
    getPublicComplaints,
    getComplaintDetails,
    voteOnComplaint,
    removeVote,
    getMyVote,
    uploadImage,
    fetchImage,
    verifyImage,
    getComplaintStatusHistory,
    getComplaintTimeline,
    getAdvancedFilteredComplaints
};

export default complaintService;

