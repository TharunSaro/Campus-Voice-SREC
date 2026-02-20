// Authoritative Enum Definitions

export const DEPARTMENTS = {
    1: 'CSE',
    2: 'ECE',
    3: 'RAA',
    4: 'MECH',
    5: 'EEE',
    6: 'EIE',
    7: 'BIO',
    8: 'AERO',
    9: 'CIVIL',
    10: 'IT',
    11: 'MBA',
    12: 'AIDS',
    13: 'MTECH_CSE'
};

export const DEPARTMENT_LIST = Object.entries(DEPARTMENTS).map(([id, name]) => ({
    id: parseInt(id),
    name
}));

export const COMPLAINT_CATEGORIES = {
    1: "Men's Hostel",
    2: "Women's Hostel",
    3: "General",
    4: "Department",
    5: "Disciplinary Committee"
};

export const CATEGORY_LIST = Object.entries(COMPLAINT_CATEGORIES).map(([id, name]) => ({
    id: parseInt(id),
    name
}));

export const STATUSES = [
    "Raised",
    "In Progress",
    "Resolved",
    "Closed",
    "Spam"
];

export const PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

export const VISIBILITY = {
    PUBLIC: "Public",
    PRIVATE: "Private"
};

export const VOTE_TYPES = {
    UPVOTE: "Upvote",
    DOWNVOTE: "Downvote"
};

export const GENDER = ["Male", "Female", "Other"];

export const STAY_TYPE = ["Hostel", "Day Scholar"];

export const AUTHORITY_TYPES = [
    "Admin",
    "Admin Officer",
    "Men's Hostel Warden",
    "Women's Hostel Warden",
    "Men's Hostel Deputy Warden",
    "Women's Hostel Deputy Warden",
    "Senior Deputy Warden",
    "HOD",
    "Disciplinary Committee"
];
