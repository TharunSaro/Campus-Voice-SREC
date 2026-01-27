const API_URL = 'https://campusvoice-api.onrender.com/api/complaints';

const createComplaint = async (complaintData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(complaintData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to submit complaint');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const getMyComplaints = async (rollNumber, limit = 50, offset = 0) => {
    try {
        const params = new URLSearchParams({
            roll_number: rollNumber,
            limit,
            offset,
        });

        const response = await fetch(`${API_URL}/my?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch complaints');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const getPublicComplaints = async (limit = 20, offset = 0, status_filter, priority_filter) => {
    try {
        const query = { limit, offset };
        if (status_filter) query.status_filter = status_filter;
        if (priority_filter) query.priority_filter = priority_filter;

        const params = new URLSearchParams(query);

        const response = await fetch(`${API_URL}/public?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch public complaints');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const getComplaintDetails = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch complaint details');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const complaintService = {
    createComplaint,
    getMyComplaints,
    getPublicComplaints,
    getComplaintDetails,
    voteComplaint: async (complaintId, rollNumber, voteType) => {
        try {
            // production API URL matches base, but we need to ensure correct endpoint
            // API_URL is .../api/complaints
            // Vote endpoint is .../api/vote (sibling to complaints)
            const BASE_URL = API_URL.replace('/complaints', '');
            const response = await fetch(`${BASE_URL}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    complaint_id: complaintId,
                    roll_number: rollNumber,
                    vote_type: voteType
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Vote failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    getVoteStats: async (complaintId) => {
        try {
            const BASE_URL = API_URL.replace('/complaints', '');
            const response = await fetch(`${BASE_URL}/vote/${complaintId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to fetch vote stats');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

export default complaintService;
