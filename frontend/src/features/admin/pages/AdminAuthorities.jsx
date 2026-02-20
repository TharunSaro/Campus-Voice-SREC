import React, { useState, useEffect } from 'react';
import adminService from '../../../services/admin.service';
import { Card, EliteButton, Badge, Skeleton } from '../../../components/UI';
import { User, Shield, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export default function AdminAuthorities() {
    const [authorities, setAuthorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAuthorities();
    }, []);

    const loadAuthorities = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllAuthorities();
            setAuthorities(data.authorities || []);
        } catch (err) {
            setError("Failed to load authorities");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await adminService.toggleAuthorityActive(id, !currentStatus);
            setAuthorities(prev => prev.map(a =>
                a.id === id ? { ...a, is_active: !currentStatus } : a
            ));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>;
    if (error) return <div className="text-center text-srec-danger py-12">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Authority Management</h1>
                    <p className="text-gray-500">Manage access and roles for all system authorities</p>
                </div>
                <EliteButton variant="primary" onClick={() => {/* Add functionality if needed later */ }}>
                    Add New Authority
                </EliteButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorities.map((auth) => (
                    <div key={auth.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group relative">
                        <div className="absolute top-4 right-4">
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-srec-primary/10 flex items-center justify-center text-srec-primary font-bold text-lg">
                                {auth.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{auth.name}</h3>
                                <p className="text-xs text-gray-500">{auth.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Role</span>
                                <span className="font-medium text-gray-900">{auth.authority_type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Department</span>
                                <span className="font-medium text-gray-900">{auth.department_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <Badge color={auth.is_active ? 'green' : 'red'}>
                                    {auth.is_active ? 'Active' : 'Disabled'}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <EliteButton
                                variant={auth.is_active ? 'danger' : 'success'}
                                size="sm"
                                className="w-full justify-center"
                                onClick={() => toggleStatus(auth.id, auth.is_active)}
                            >
                                {auth.is_active ? 'Disable Account' : 'Enable Account'}
                            </EliteButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
