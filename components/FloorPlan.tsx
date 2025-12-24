import React, { useState, useMemo } from 'react';
import {
    Layout, Plus, Edit3, Trash2, Users, Clock, X, Save, Circle, Square, RectangleHorizontal
} from 'lucide-react';
import { Language, RestaurantTable, TableShape, Reservation } from '../types';

interface Props {
    lang: Language;
    tables: RestaurantTable[];
    reservations: Reservation[];
    onUpdateTables: (tables: RestaurantTable[]) => void;
    isAdmin?: boolean;
}

const FloorPlan: React.FC<Props> = ({ lang, tables, reservations, onUpdateTables, isAdmin = false }) => {
    const [editMode, setEditMode] = useState(false);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        capacity: 4,
        shape: 'round' as TableShape,
        x: 50,
        y: 50
    });

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            title: 'Masa Planı',
            editMode: 'Düzenle',
            addTable: 'Masa Ekle',
            tableName: 'Masa Adı',
            capacity: 'Kapasite',
            shape: 'Şekil',
            round: 'Yuvarlak',
            square: 'Kare',
            rectangle: 'Dikdörtgen',
            save: 'Kaydet',
            cancel: 'İptal',
            delete: 'Sil',
            available: 'Boş',
            occupied: 'Dolu',
            reserved: 'Rezerve',
            guests: 'kişi',
            noReservation: 'Rezervasyon yok',
            todayReservation: 'Bugünkü Rezervasyon'
        },
        de: {
            title: 'Tischplan',
            editMode: 'Bearbeiten',
            addTable: 'Tisch hinzufügen',
            tableName: 'Tischname',
            capacity: 'Kapazität',
            shape: 'Form',
            round: 'Rund',
            square: 'Quadrat',
            rectangle: 'Rechteck',
            save: 'Speichern',
            cancel: 'Abbrechen',
            delete: 'Löschen',
            available: 'Frei',
            occupied: 'Besetzt',
            reserved: 'Reserviert',
            guests: 'Pers.',
            noReservation: 'Keine Reservierung',
            todayReservation: 'Heutige Reservierung'
        },
        en: {
            title: 'Floor Plan',
            editMode: 'Edit',
            addTable: 'Add Table',
            tableName: 'Table Name',
            capacity: 'Capacity',
            shape: 'Shape',
            round: 'Round',
            square: 'Square',
            rectangle: 'Rectangle',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            available: 'Available',
            occupied: 'Occupied',
            reserved: 'Reserved',
            guests: 'guests',
            noReservation: 'No reservation',
            todayReservation: 'Today\'s Reservation'
        },
        es: {
            title: 'Plano del Local',
            editMode: 'Editar',
            addTable: 'Añadir Mesa',
            tableName: 'Nombre de Mesa',
            capacity: 'Capacidad',
            shape: 'Forma',
            round: 'Redonda',
            square: 'Cuadrada',
            rectangle: 'Rectangular',
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            available: 'Disponible',
            occupied: 'Ocupada',
            reserved: 'Reservada',
            guests: 'pers.',
            noReservation: 'Sin reserva',
            todayReservation: 'Reserva de Hoy'
        }
    };

    const t = translations[lang] || translations.de;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === todayStr && r.status !== 'cancelled');

    // Get table status based on reservations
    const getTableStatus = (tableId: string) => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        // Check if any reservation is currently active (within 2 hour window)
        const activeReservation = todayReservations.find(r => {
            const resHour = parseInt(r.time.split(':')[0]);
            const resMinute = parseInt(r.time.split(':')[1]);
            const diffMinutes = (currentHour * 60 + currentMinute) - (resHour * 60 + resMinute);
            return diffMinutes >= -30 && diffMinutes <= 120; // 30 min before to 2 hours after
        });

        if (activeReservation?.status === 'seated') return 'occupied';
        if (activeReservation) return 'reserved';
        return 'available';
    };

    const getTableReservation = (tableId: string) => {
        return todayReservations.find(r => r.status !== 'cancelled');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500/20 border-green-500 text-green-500';
            case 'occupied': return 'bg-red-500/20 border-red-500 text-red-500';
            case 'reserved': return 'bg-yellow-500/20 border-yellow-500 text-yellow-500';
            default: return 'bg-white/10 border-white/20 text-white';
        }
    };

    const handleAddTable = () => {
        const newTable: RestaurantTable = {
            id: `table-${Date.now()}`,
            name: formData.name || `T${tables.length + 1}`,
            capacity: formData.capacity,
            shape: formData.shape,
            x: formData.x,
            y: formData.y
        };
        onUpdateTables([...tables, newTable]);
        setShowAddModal(false);
        setFormData({ name: '', capacity: 4, shape: 'round', x: 50, y: 50 });
    };

    const handleDeleteTable = (id: string) => {
        onUpdateTables(tables.filter(t => t.id !== id));
        setSelectedTable(null);
    };

    const handleDrag = (id: string, e: React.MouseEvent) => {
        if (!editMode) return;

        const container = e.currentTarget.parentElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onUpdateTables(tables.map(t =>
            t.id === id ? { ...t, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : t
        ));
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <Layout className="text-primary" size={24} />
                    {t.title}
                </h2>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cut-corners ${editMode ? 'bg-primary text-gray-900' : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            <Edit3 size={14} className="inline mr-1" />
                            {t.editMode}
                        </button>
                        {editMode && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="p-2 bg-green-500 text-white cut-corners"
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500">{t.available}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-gray-500">{t.reserved}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-gray-500">{t.occupied}</span>
                </div>
            </div>

            {/* Floor Plan Area */}
            <div
                className="relative bg-white border-2 border-gray-200 aspect-[4/3] overflow-hidden cut-corners-lg"
                style={{ minHeight: '400px' }}
            >
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(10)].map((_, i) => (
                        <div key={`h-${i}`} className="absolute w-full h-px bg-gray-200" style={{ top: `${i * 10}%` }} />
                    ))}
                    {[...Array(10)].map((_, i) => (
                        <div key={`v-${i}`} className="absolute h-full w-px bg-gray-200" style={{ left: `${i * 10}%` }} />
                    ))}
                </div>

                {/* Tables */}
                {tables.map(table => {
                    const status = getTableStatus(table.id);
                    const reservation = getTableReservation(table.id);
                    const isSelected = selectedTable?.id === table.id;

                    return (
                        <div
                            key={table.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${editMode ? 'cursor-move' : ''
                                }`}
                            style={{ left: `${table.x}%`, top: `${table.y}%` }}
                            onClick={() => !editMode && setSelectedTable(table)}
                            onMouseDown={(e) => editMode && handleDrag(table.id, e)}
                        >
                            <div
                                className={`
                  relative flex flex-col items-center justify-center border-2 transition-all
                  ${getStatusColor(status)}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-110' : ''}
                  ${table.shape === 'round' ? 'rounded-full w-16 h-16' : ''}
                  ${table.shape === 'square' ? 'rounded-lg w-14 h-14' : ''}
                  ${table.shape === 'rectangle' ? 'rounded-lg w-20 h-12' : ''}
                `}
                            >
                                <span className="font-black text-lg">{table.name}</span>
                                <span className="text-[10px] opacity-60">{table.capacity}p</span>
                            </div>

                            {/* Delete button in edit mode */}
                            {editMode && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.id); }}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <X size={12} className="text-white" />
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Empty state */}
                {tables.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Layout size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">{isAdmin ? t.addTable : 'No tables configured'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Table Info */}
            {selectedTable && !editMode && (
                <div className="bg-white p-5 border-2 border-gray-200 animate-in slide-in-from-bottom duration-300 cut-corners">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(getTableStatus(selectedTable.id))}`}>
                                {selectedTable.shape === 'round' && <Circle size={24} />}
                                {selectedTable.shape === 'square' && <Square size={24} />}
                                {selectedTable.shape === 'rectangle' && <RectangleHorizontal size={24} />}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{selectedTable.name}</p>
                                <p className="text-xs text-gray-500">{selectedTable.capacity} {t.guests}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedTable(null)} className="p-3 bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-colors cut-corners">
                            <X size={24} className="text-primary" />
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 cut-corners">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            {t.todayReservation}
                        </p>
                        {getTableReservation(selectedTable.id) ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-900 font-bold">{getTableReservation(selectedTable.id)?.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {getTableReservation(selectedTable.id)?.time}
                                        <Users size={12} className="ml-2" />
                                        {getTableReservation(selectedTable.id)?.guests}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">{t.noReservation}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Add Table Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm p-6 space-y-5 border-2 border-primary cut-corners-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">{t.addTable}</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-3 bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-colors cut-corners">
                                <X size={24} className="text-primary" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.tableName}</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="A1, B2..."
                                    className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm cut-corners"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.capacity}</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
                                    min={1}
                                    max={20}
                                    className="w-full bg-gray-100 border-2 border-gray-200 py-3 px-4 text-gray-900 text-sm cut-corners"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.shape}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['round', 'square', 'rectangle'] as TableShape[]).map(shape => (
                                        <button
                                            key={shape}
                                            onClick={() => setFormData({ ...formData, shape })}
                                            className={`py-3 text-xs font-bold flex flex-col items-center gap-1 transition-all cut-corners ${formData.shape === shape ? 'bg-primary text-gray-900' : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {shape === 'round' && <Circle size={16} />}
                                            {shape === 'square' && <Square size={16} />}
                                            {shape === 'rectangle' && <RectangleHorizontal size={16} />}
                                            {t[shape]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddTable}
                                className="w-full bg-primary text-gray-900 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-neon cut-corners"
                            >
                                <Save size={16} />
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloorPlan;
