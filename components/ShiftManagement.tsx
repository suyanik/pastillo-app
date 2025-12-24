import React, { useState, useMemo } from 'react';
import {
    Calendar, ChevronLeft, ChevronRight, Plus, X, Clock,
    User, Check, Trash2, Edit3, Sun, Moon, Coffee
} from 'lucide-react';
import { Language, Personnel, Shift, ShiftType } from '../types';
import { addShift, updateShift, deleteShift } from '../services/firebase';

interface Props {
    lang: Language;
    personnel: Personnel[];
    shifts: Shift[];
}

const ShiftManagement: React.FC<Props> = ({ lang, personnel, shifts }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        personnelId: '',
        type: 'full' as ShiftType,
        startTime: '11:00',
        endTime: '23:00',
        notes: ''
    });

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            title: 'Vardiya Planlama',
            addShift: 'Vardiya Ekle',
            selectPerson: 'Personel Seç',
            shiftType: 'Vardiya Tipi',
            morning: 'Sabah',
            afternoon: 'Öğleden Sonra',
            evening: 'Akşam',
            full: 'Tam Gün',
            startTime: 'Başlangıç',
            endTime: 'Bitiş',
            notes: 'Notlar',
            save: 'Kaydet',
            cancel: 'İptal',
            noShifts: 'Bu gün için vardiya yok',
            delete: 'Sil',
            edit: 'Düzenle'
        },
        de: {
            title: 'Schichtplanung',
            addShift: 'Schicht hinzufügen',
            selectPerson: 'Personal auswählen',
            shiftType: 'Schichttyp',
            morning: 'Früh',
            afternoon: 'Nachmittag',
            evening: 'Abend',
            full: 'Ganztags',
            startTime: 'Beginn',
            endTime: 'Ende',
            notes: 'Notizen',
            save: 'Speichern',
            cancel: 'Abbrechen',
            noShifts: 'Keine Schichten für diesen Tag',
            delete: 'Löschen',
            edit: 'Bearbeiten'
        },
        en: {
            title: 'Shift Planning',
            addShift: 'Add Shift',
            selectPerson: 'Select Person',
            shiftType: 'Shift Type',
            morning: 'Morning',
            afternoon: 'Afternoon',
            evening: 'Evening',
            full: 'Full Day',
            startTime: 'Start',
            endTime: 'End',
            notes: 'Notes',
            save: 'Save',
            cancel: 'Cancel',
            noShifts: 'No shifts for this day',
            delete: 'Delete',
            edit: 'Edit'
        },
        es: {
            title: 'Planificación de Turnos',
            addShift: 'Añadir Turno',
            selectPerson: 'Seleccionar Persona',
            shiftType: 'Tipo de Turno',
            morning: 'Mañana',
            afternoon: 'Tarde',
            evening: 'Noche',
            full: 'Día Completo',
            startTime: 'Inicio',
            endTime: 'Fin',
            notes: 'Notas',
            save: 'Guardar',
            cancel: 'Cancelar',
            noShifts: 'Sin turnos para este día',
            delete: 'Eliminar',
            edit: 'Editar'
        }
    };

    const t = translations[lang] || translations.de;

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const calendarDays = useMemo(() => {
        const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Previous month days
        const prevMonth = new Date(year, month - 1, 1);
        const prevMonthDays = getDaysInMonth(prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dateStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            days.push({ date: dateStr, day, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ date: dateStr, day: i, isCurrentMonth: true });
        }

        // Next month days
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const nextMonth = new Date(year, month + 1, 1);
            const dateStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ date: dateStr, day: i, isCurrentMonth: false });
        }

        return days;
    }, [currentDate]);

    const getShiftsForDate = (date: string) => {
        return shifts.filter(s => s.date === date);
    };

    const getShiftColor = (type: ShiftType) => {
        switch (type) {
            case 'morning': return 'bg-yellow-500';
            case 'afternoon': return 'bg-orange-500';
            case 'evening': return 'bg-purple-500';
            case 'full': return 'bg-green-500';
        }
    };

    const getShiftIcon = (type: ShiftType) => {
        switch (type) {
            case 'morning': return <Sun size={12} />;
            case 'afternoon': return <Coffee size={12} />;
            case 'evening': return <Moon size={12} />;
            case 'full': return <Clock size={12} />;
        }
    };

    const handleSaveShift = async () => {
        if (!formData.personnelId || !selectedDate) return;

        const person = personnel.find(p => p.id === formData.personnelId);
        const shiftData = {
            personnelId: formData.personnelId,
            personnelName: person ? `${person.firstName} ${person.lastName}` : '',
            date: selectedDate,
            type: formData.type,
            startTime: formData.startTime,
            endTime: formData.endTime,
            notes: formData.notes
        };

        try {
            if (editingShift) {
                await updateShift(editingShift.id, shiftData);
            } else {
                await addShift(shiftData);
            }
            setShowAddForm(false);
            setEditingShift(null);
            setFormData({ personnelId: '', type: 'full', startTime: '11:00', endTime: '23:00', notes: '' });
        } catch (error) {
            console.error('Error saving shift:', error);
        }
    };

    const handleDeleteShift = async (id: string) => {
        if (confirm('Bu vardiyayı silmek istediğinizden emin misiniz?')) {
            await deleteShift(id);
        }
    };

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift);
        setSelectedDate(shift.date);
        setFormData({
            personnelId: shift.personnelId,
            type: shift.type,
            startTime: shift.startTime,
            endTime: shift.endTime,
            notes: shift.notes || ''
        });
        setShowAddForm(true);
    };

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        setShowAddForm(true);
        setEditingShift(null);
        setFormData({ personnelId: '', type: 'full', startTime: '11:00', endTime: '23:00', notes: '' });
    };

    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <Calendar className="text-primary" size={24} />
                    {t.title}
                </h2>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white p-4 border-2 border-gray-200 cut-corners">
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 transition-all cut-corners"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h3 className="text-lg font-bold text-gray-900">
                    {currentDate.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white p-4 border-2 border-gray-200 cut-corners-lg">
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        const dayShifts = getShiftsForDate(day.date);
                        const isToday = day.date === new Date().toISOString().split('T')[0];

                        return (
                            <button
                                key={idx}
                                onClick={() => handleDayClick(day.date)}
                                className={`
                  aspect-square p-1 rounded-xl text-center relative transition-all
                  ${day.isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-transparent opacity-30'}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                `}
                            >
                                <span className={`text-xs font-bold ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {day.day}
                                </span>
                                {dayShifts.length > 0 && (
                                    <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                                        {dayShifts.slice(0, 3).map((shift, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${getShiftColor(shift.type)}`} />
                                        ))}
                                        {dayShifts.length > 3 && (
                                            <span className="text-[8px] text-gray-500">+{dayShifts.length - 3}</span>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 justify-center">
                {(['morning', 'afternoon', 'evening', 'full'] as ShiftType[]).map(type => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${getShiftColor(type)}`} />
                        <span className="text-[10px] font-bold text-gray-500">{t[type]}</span>
                    </div>
                ))}
            </div>

            {/* Selected Day Shifts */}
            {selectedDate && !showAddForm && (
                <div className="bg-white p-6 border-2 border-gray-200 space-y-4 cut-corners-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">
                            {new Date(selectedDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </h3>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="p-2 bg-primary text-gray-900 cut-corners"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {getShiftsForDate(selectedDate).length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">{t.noShifts}</p>
                    ) : (
                        <div className="space-y-2">
                            {getShiftsForDate(selectedDate).map(shift => (
                                <div key={shift.id} className="bg-gray-50 p-4 border border-gray-200 flex items-center justify-between cut-corners">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${getShiftColor(shift.type)} text-white`}>
                                            {getShiftIcon(shift.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{shift.personnelName}</p>
                                            <p className="text-xs text-gray-500">{shift.startTime} - {shift.endTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditShift(shift)} className="p-2 bg-gray-100 text-gray-500 hover:text-gray-900 cut-corners">
                                            <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteShift(shift.id)} className="p-2 bg-red-50 text-red-500 cut-corners">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Shift Form */}
            {showAddForm && (
                <div className="bg-white p-6 border-2 border-primary space-y-4 animate-in slide-in-from-bottom duration-300 cut-corners-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">{editingShift ? t.edit : t.addShift}</h3>
                        <button onClick={() => { setShowAddForm(false); setEditingShift(null); }} className="p-3 bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-colors cut-corners">
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

                        {/* Shift Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.shiftType}</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['morning', 'afternoon', 'evening', 'full'] as ShiftType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`py-3 text-xs font-bold transition-all flex flex-col items-center gap-1 cut-corners ${formData.type === type ? `${getShiftColor(type)} text-white` : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {getShiftIcon(type)}
                                        {t[type]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.startTime}</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm cut-corners"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.endTime}</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.notes}</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                rows={2}
                                className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm resize-none cut-corners"
                                placeholder="..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSaveShift}
                            disabled={!formData.personnelId}
                            className="w-full bg-primary text-gray-900 py-4 font-bold text-sm uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all hover:shadow-neon cut-corners"
                        >
                            {t.save}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftManagement;
