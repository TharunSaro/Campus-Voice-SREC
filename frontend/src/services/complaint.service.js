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

const complaintService = {
    createComplaint,
};

export default complaintService;
