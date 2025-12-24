import React, { useState } from 'react';
import {
    FileText, Plus, X, Check, XCircle, Clock,
    Calendar, User, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Language, Personnel, LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { addLeaveRequest, updateLeaveStatus, deleteLeaveRequest } from '../services/firebase';

interface Props {
    lang: Language;
    personnel: Personnel[];
    leaveRequests: LeaveRequest[];
    isAdmin?: boolean;
}

const LeaveManagement: React.FC<Props> = ({ lang, personnel, leaveRequests, isAdmin = true }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState<LeaveStatus | 'all'>('all');

    const [formData, setFormData] = useState({
        personnelId: '',
        type: 'annual' as LeaveType,
        startDate: '',
        endDate: '',
        reason: ''
    });

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            title: 'İzin Yönetimi',
            addRequest: 'İzin Talebi',
            selectPerson: 'Personel Seç',
            leaveType: 'İzin Tipi',
            annual: 'Yıllık İzin',
            sick: 'Hastalık İzni',
            unpaid: 'Ücretsiz İzin',
            other: 'Diğer',
            startDate: 'Başlangıç',
            endDate: 'Bitiş',
            reason: 'Sebep',
            submit: 'Talep Gönder',
            cancel: 'İptal',
            pending: 'Beklemede',
            approved: 'Onaylandı',
            rejected: 'Reddedildi',
            all: 'Tümü',
            approve: 'Onayla',
            reject: 'Reddet',
            noRequests: 'İzin talebi yok',
            days: 'gün'
        },
        de: {
            title: 'Urlaubsverwaltung',
            addRequest: 'Urlaubsantrag',
            selectPerson: 'Mitarbeiter auswählen',
            leaveType: 'Urlaubsart',
            annual: 'Jahresurlaub',
            sick: 'Krankmeldung',
            unpaid: 'Unbezahlter Urlaub',
            other: 'Sonstiges',
            startDate: 'Beginn',
            endDate: 'Ende',
            reason: 'Grund',
            submit: 'Antrag senden',
            cancel: 'Abbrechen',
            pending: 'Ausstehend',
            approved: 'Genehmigt',
            rejected: 'Abgelehnt',
            all: 'Alle',
            approve: 'Genehmigen',
            reject: 'Ablehnen',
            noRequests: 'Keine Urlaubsanträge',
            days: 'Tage'
        },
        en: {
            title: 'Leave Management',
            addRequest: 'Leave Request',
            selectPerson: 'Select Person',
            leaveType: 'Leave Type',
            annual: 'Annual Leave',
            sick: 'Sick Leave',
            unpaid: 'Unpaid Leave',
            other: 'Other',
            startDate: 'Start Date',
            endDate: 'End Date',
            reason: 'Reason',
            submit: 'Submit Request',
            cancel: 'Cancel',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            all: 'All',
            approve: 'Approve',
            reject: 'Reject',
            noRequests: 'No leave requests',
            days: 'days'
        },
        es: {
            title: 'Gestión de Permisos',
            addRequest: 'Solicitud de Permiso',
            selectPerson: 'Seleccionar Persona',
            leaveType: 'Tipo de Permiso',
            annual: 'Vacaciones Anuales',
            sick: 'Baja por Enfermedad',
            unpaid: 'Permiso sin Sueldo',
            other: 'Otro',
            startDate: 'Fecha Inicio',
            endDate: 'Fecha Fin',
            reason: 'Motivo',
            submit: 'Enviar Solicitud',
            cancel: 'Cancelar',
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            all: 'Todos',
            approve: 'Aprobar',
            reject: 'Rechazar',
            noRequests: 'No hay solicitudes',
            days: 'días'
        }
    };

    const t = translations[lang] || translations.de;

    const getStatusColor = (status: LeaveStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
        }
    };

    const getStatusIcon = (status: LeaveStatus) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'approved': return <CheckCircle2 size={14} />;
            case 'rejected': return <XCircle size={14} />;
        }
    };

    const getTypeColor = (type: LeaveType) => {
        switch (type) {
            case 'annual': return 'bg-blue-500';
            case 'sick': return 'bg-red-500';
            case 'unpaid': return 'bg-gray-500';
            case 'other': return 'bg-purple-500';
        }
    };

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleSubmit = async () => {
        if (!formData.personnelId || !formData.startDate || !formData.endDate) return;

        const person = personnel.find(p => p.id === formData.personnelId);

        try {
            await addLeaveRequest({
                personnelId: formData.personnelId,
                personnelName: person ? `${person.firstName} ${person.lastName}` : '',
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
                status: 'pending'
            });
            setShowAddForm(false);
            setFormData({ personnelId: '', type: 'annual', startDate: '', endDate: '', reason: '' });
        } catch (error) {
            console.error('Error submitting leave request:', error);
        }
    };

    const handleStatusChange = async (id: string, status: LeaveStatus) => {
        try {
            await updateLeaveStatus(id, status);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredRequests = filter === 'all'
        ? leaveRequests
        : leaveRequests.filter(r => r.status === filter);

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <FileText className="text-primary" size={24} />
                    {t.title}
                </h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="p-3 bg-primary text-gray-900 cut-corners hover:shadow-neon transition-all"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1.5 border-2 border-gray-200 cut-corners">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all cut-corners ${filter === status ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t[status]}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                    <div className="bg-white p-8 border-2 border-gray-200 text-center cut-corners-lg">
                        <p className="text-gray-500 text-sm">{t.noRequests}</p>
                    </div>
                ) : (
                    filteredRequests.map(request => (
                        <div key={request.id} className="bg-white p-5 border-2 border-gray-200 space-y-3 cut-corners">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${getTypeColor(request.type)}`}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{request.personnelName}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t[request.type]}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                                    {getStatusIcon(request.status)}
                                    {t[request.status]}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-primary" />
                                    <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                                </div>
                                <span className="px-2 py-0.5 bg-gray-100 text-xs font-bold">
                                    {calculateDays(request.startDate, request.endDate)} {t.days}
                                </span>
                            </div>

                            {request.reason && (
                                <p className="text-xs text-gray-500 italic">"{request.reason}"</p>
                            )}

                            {/* Admin Actions */}
                            {isAdmin && request.status === 'pending' && (
                                <div className="flex gap-2 pt-2 border-t border-gray-200">
                                    <button
                                        onClick={() => handleStatusChange(request.id, 'approved')}
                                        className="flex-1 py-3 bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-100 transition-all cut-corners"
                                    >
                                        <Check size={16} />
                                        {t.approve}
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(request.id, 'rejected')}
                                        className="flex-1 py-3 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-all cut-corners"
                                    >
                                        <XCircle size={16} />
                                        {t.reject}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md p-6 space-y-5 animate-in slide-in-from-bottom duration-300 border-2 border-primary cut-corners-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">{t.addRequest}</h3>
                            <button onClick={() => setShowAddForm(false)} className="p-3 bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-colors cut-corners">
                                <X size={24} className="text-primary" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Personnel Select */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.selectPerson}</label>
                                <select
                                    value={formData.personnelId}
                                    onChange={e => setFormData({ ...formData, personnelId: e.target.value })}
                                    className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm cut-corners"
                                >
                                    <option value="">-- {t.selectPerson} --</option>
                                    {personnel.map(p => (
                                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Leave Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.leaveType}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['annual', 'sick', 'unpaid', 'other'] as LeaveType[]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`py-3 text-xs font-bold transition-all cut-corners ${formData.type === type ? `${getTypeColor(type)} text-white` : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {t[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.startDate}</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm cut-corners"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.endDate}</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.reason}</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    rows={3}
                                    className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm resize-none cut-corners"
                                    placeholder="..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.personnelId || !formData.startDate || !formData.endDate}
                                className="w-full bg-primary text-gray-900 py-4 font-bold text-sm uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all hover:shadow-neon cut-corners"
                            >
                                {t.submit}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
