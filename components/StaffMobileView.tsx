import React, { useState, useMemo } from 'react';
import {
    Coffee, LogIn, LogOut, Clock, Users, ChefHat, Check, Plus, Minus,
    ShoppingBag, X, Circle, Square, RectangleHorizontal, Bell, Timer
} from 'lucide-react';
import { Language, RestaurantTable, Reservation, Order, OrderItem, Personnel } from '../types';

interface Props {
    lang: Language;
    tables: RestaurantTable[];
    reservations: Reservation[];
    orders: Order[];
    currentStaff: Personnel | null;
    onAddOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
    onCheckIn: () => void;
    onCheckOut: () => void;
}

// Basit menü (gerçek uygulamada Firebase'den gelecek)
const MENU_ITEMS = [
    {
        category: 'Vorspeisen', items: [
            { name: 'Bruschetta', price: 6.50 },
            { name: 'Caprese', price: 8.50 },
            { name: 'Carpaccio', price: 12.00 }
        ]
    },
    {
        category: 'Pizza', items: [
            { name: 'Margherita', price: 10.00 },
            { name: 'Salami', price: 12.00 },
            { name: 'Quattro Formaggi', price: 13.50 }
        ]
    },
    {
        category: 'Pasta', items: [
            { name: 'Spaghetti Bolognese', price: 12.00 },
            { name: 'Penne Arrabiata', price: 11.00 },
            { name: 'Lasagne', price: 14.00 }
        ]
    },
    {
        category: 'Getränke', items: [
            { name: 'Cola/Fanta/Sprite', price: 3.50 },
            { name: 'Wasser', price: 2.50 },
            { name: 'Bier 0.5L', price: 4.50 },
            { name: 'Hauswein', price: 5.00 }
        ]
    }
];

const StaffMobileView: React.FC<Props> = ({
    lang, tables, reservations, orders, currentStaff,
    onAddOrder, onUpdateOrderStatus, onCheckIn, onCheckOut
}) => {
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
    const [showOrderPanel, setShowOrderPanel] = useState(false);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [activeTab, setActiveTab] = useState<'tables' | 'orders'>('tables');

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            welcome: 'Hoş Geldin',
            checkIn: 'Vardiya Başlat',
            checkOut: 'Vardiya Bitir',
            tables: 'Masalar',
            orders: 'Siparişler',
            newOrder: 'Yeni Sipariş',
            addToOrder: 'Ekle',
            sendOrder: 'Siparişi Gönder',
            cart: 'Sepet',
            empty: 'Boş',
            total: 'Toplam',
            pending: 'Bekliyor',
            preparing: 'Hazırlanıyor',
            ready: 'Hazır',
            served: 'Servis Edildi',
            guests: 'kişi',
            available: 'Boş',
            occupied: 'Dolu',
            reserved: 'Rezerve'
        },
        de: {
            welcome: 'Willkommen',
            checkIn: 'Schicht starten',
            checkOut: 'Schicht beenden',
            tables: 'Tische',
            orders: 'Bestellungen',
            newOrder: 'Neue Bestellung',
            addToOrder: 'Hinzufügen',
            sendOrder: 'Bestellung senden',
            cart: 'Warenkorb',
            empty: 'Leer',
            total: 'Gesamt',
            pending: 'Ausstehend',
            preparing: 'In Zubereitung',
            ready: 'Fertig',
            served: 'Serviert',
            guests: 'Pers.',
            available: 'Frei',
            occupied: 'Besetzt',
            reserved: 'Reserviert'
        },
        en: {
            welcome: 'Welcome',
            checkIn: 'Start Shift',
            checkOut: 'End Shift',
            tables: 'Tables',
            orders: 'Orders',
            newOrder: 'New Order',
            addToOrder: 'Add',
            sendOrder: 'Send Order',
            cart: 'Cart',
            empty: 'Empty',
            total: 'Total',
            pending: 'Pending',
            preparing: 'Preparing',
            ready: 'Ready',
            served: 'Served',
            guests: 'guests',
            available: 'Available',
            occupied: 'Occupied',
            reserved: 'Reserved'
        },
        es: {
            welcome: 'Bienvenido',
            checkIn: 'Iniciar Turno',
            checkOut: 'Terminar Turno',
            tables: 'Mesas',
            orders: 'Pedidos',
            newOrder: 'Nuevo Pedido',
            addToOrder: 'Añadir',
            sendOrder: 'Enviar Pedido',
            cart: 'Carrito',
            empty: 'Vacío',
            total: 'Total',
            pending: 'Pendiente',
            preparing: 'Preparando',
            ready: 'Listo',
            served: 'Servido',
            guests: 'pers.',
            available: 'Disponible',
            occupied: 'Ocupada',
            reserved: 'Reservada'
        }
    };

    const t = translations[lang] || translations.de;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === todayStr && r.status !== 'cancelled');

    const getTableStatus = (tableId: string): 'available' | 'occupied' | 'reserved' => {
        const tableOrders = orders.filter(o => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled');
        if (tableOrders.length > 0) return 'occupied';

        const now = new Date();
        const currentHour = now.getHours();
        const activeReservation = todayReservations.find(r => {
            const resHour = parseInt(r.time.split(':')[0]);
            return Math.abs(currentHour - resHour) <= 1;
        });
        if (activeReservation) return 'reserved';
        return 'available';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500/30 border-green-500 text-green-400';
            case 'occupied': return 'bg-red-500/30 border-red-500 text-red-400';
            case 'reserved': return 'bg-yellow-500/30 border-yellow-500 text-yellow-400';
            default: return 'bg-white/10 border-white/20 text-white';
        }
    };

    const activeOrders = useMemo(() =>
        orders.filter(o => o.status !== 'served' && o.status !== 'cancelled'),
        [orders]
    );

    const addToCart = (item: { name: string; price: number }) => {
        const existing = cart.find(c => c.name === item.name);
        if (existing) {
            setCart(cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { id: Date.now().toString(), name: item.name, price: item.price, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId: string) => {
        const item = cart.find(c => c.id === itemId);
        if (item && item.quantity > 1) {
            setCart(cart.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
        } else {
            setCart(cart.filter(c => c.id !== itemId));
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSendOrder = () => {
        if (!selectedTable || cart.length === 0) return;

        onAddOrder({
            tableId: selectedTable.id,
            tableName: selectedTable.name,
            items: cart,
            status: 'pending',
            total: cartTotal,
            staffId: currentStaff?.id,
            staffName: currentStaff ? `${currentStaff.firstName} ${currentStaff.lastName}` : undefined
        });

        setCart([]);
        setShowOrderPanel(false);
        setSelectedTable(null);
    };

    const handleCheckInOut = () => {
        if (isCheckedIn) {
            onCheckOut();
            setIsCheckedIn(false);
        } else {
            onCheckIn();
            setIsCheckedIn(true);
        }
    };

    // Check-in ekranı
    if (!isCheckedIn) {
        return (
            <div className="min-h-screen bg-background-light hex-pattern flex flex-col items-center justify-center p-6">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coffee size={40} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t.welcome}, {currentStaff?.firstName || 'Staff'}
                    </h1>
                    <p className="text-gray-500 text-sm">Pastillo Restaurant & Bar</p>
                </div>

                <button
                    onClick={handleCheckInOut}
                    className="w-full max-w-xs bg-primary text-gray-900 py-5 font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all hover:shadow-neon cut-corners"
                >
                    <LogIn size={24} />
                    {t.checkIn}
                </button>

                <p className="text-gray-400 text-xs mt-6">
                    {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', {
                        weekday: 'long', day: 'numeric', month: 'long'
                    })}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light hex-pattern pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 px-4 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Coffee size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{currentStaff?.firstName || 'Staff'}</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckInOut}
                        className="px-4 py-2 bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 cut-corners"
                    >
                        <LogOut size={14} />
                        {t.checkOut}
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-4 bg-gray-100 mx-4 mt-4 border-2 border-gray-200 cut-corners">
                <button
                    onClick={() => setActiveTab('tables')}
                    className={`flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 cut-corners ${activeTab === 'tables' ? 'bg-primary text-gray-900' : 'text-gray-500'
                        }`}
                >
                    <Users size={16} />
                    {t.tables}
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 relative cut-corners ${activeTab === 'orders' ? 'bg-primary text-gray-900' : 'text-gray-500'
                        }`}
                >
                    <ShoppingBag size={16} />
                    {t.orders}
                    {activeOrders.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                            {activeOrders.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tables View */}
            {activeTab === 'tables' && (
                <div className="p-4 space-y-4">
                    {/* Table Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {tables.map(table => {
                            const status = getTableStatus(table.id);
                            return (
                                <button
                                    key={table.id}
                                    onClick={() => { setSelectedTable(table); setShowOrderPanel(true); }}
                                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${getStatusColor(status)}`}
                                >
                                    <span className="text-2xl font-black">{table.name}</span>
                                    <span className="text-[10px] opacity-60">{table.capacity}p</span>
                                    <span className="text-[9px] mt-1 uppercase font-bold opacity-80">{t[status]}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-4 py-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-[10px] text-gray-500">{t.available}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-[10px] text-gray-500">{t.reserved}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-[10px] text-gray-500">{t.occupied}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders View */}
            {activeTab === 'orders' && (
                <div className="p-4 space-y-3">
                    {activeOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">Aktif sipariş yok</p>
                        </div>
                    ) : (
                        activeOrders.map(order => (
                            <div key={order.id} className="bg-white border-2 border-gray-200 p-4 cut-corners">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                            <span className="text-primary font-black">{order.tableName}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.items.length} ürün</p>
                                            <p className="text-xs text-gray-500">€{order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                        order.status === 'preparing' ? 'bg-blue-500/20 text-blue-500' :
                                            order.status === 'ready' ? 'bg-green-500/20 text-green-500' :
                                                'bg-white/10 text-white/50'
                                        }`}>
                                        {t[order.status]}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-600 mb-3">
                                    {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                </div>

                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => onUpdateOrderStatus(order.id, 'served')}
                                        className="w-full py-2 bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                                    >
                                        <Check size={14} />
                                        Servis Edildi
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Order Panel Modal */}
            {showOrderPanel && selectedTable && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <span className="text-primary font-black">{selectedTable.name}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{t.newOrder}</p>
                                <p className="text-xs text-white/40">{selectedTable.capacity} {t.guests}</p>
                            </div>
                        </div>
                        <button onClick={() => { setShowOrderPanel(false); setCart([]); }} className="p-2 bg-white/5 rounded-xl">
                            <X size={24} className="text-primary" />
                        </button>
                    </div>

                    {/* Menu */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {MENU_ITEMS.map(category => (
                            <div key={category.category}>
                                <h3 className="text-xs font-black text-white/30 uppercase tracking-widest mb-2">{category.category}</h3>
                                <div className="space-y-2">
                                    {category.items.map(item => (
                                        <div key={item.name} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.name}</p>
                                                <p className="text-xs text-primary font-bold">€{item.price.toFixed(2)}</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Footer */}
                    {cart.length > 0 && (
                        <div className="p-4 border-t border-white/10 bg-[#111]">
                            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <span className="text-white">{item.quantity}x {item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/50">€{(item.price * item.quantity).toFixed(2)}</span>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/50 font-bold">{t.total}</span>
                                <span className="text-xl font-black text-primary">€{cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleSendOrder}
                                className="w-full py-4 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <ChefHat size={18} />
                                {t.sendOrder}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StaffMobileView;
