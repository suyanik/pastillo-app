
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Phone, Briefcase, Calendar, Trash2, 
  UserPlus, Search, X, ChevronRight, CreditCard, 
  Landmark, Fingerprint, Banknote, History, Wallet, CheckCircle2, AlertCircle,
  MapPin, Globe, Activity, ShieldCheck, Info
} from 'lucide-react';
import { Personnel, Language, PersonnelPayment } from '../types';

interface Props {
  lang: Language;
}

const PersonnelManagement: React.FC<Props> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<'salary' | 'advance' | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const translations = {
    tr: {
      title: 'Personel Yönetimi',
      count: 'Çalışan Sayısı',
      add: 'Yeni Personel Kaydı',
      search: 'İsim veya görev ara...',
      personalInfo: 'Kişisel Bilgiler',
      legalInfo: 'Resmi & Yasal Bilgiler',
      bankInfo: 'Banka & Ödeme Bilgileri',
      salaryInfo: 'Maaş Durumu',
      firstName: 'Adı',
      lastName: 'Soyadı',
      dob: 'Doğum Tarihi',
      pob: 'Doğum Yeri',
      address: 'Adres',
      nationality: 'Uyruk',
      healthIns: 'Krankkasse',
      taxId: 'Steuer ID',
      ssn: 'Sozialversicherungnummer',
      bank: 'Banka Adı',
      iban: 'IBAN',
      bic: 'BIC',
      startDate: 'İşe Giriş Tarihi',
      endDate: 'İşten Çıkış Tarihi',
      baseSalary: 'Aylık Net Maaş',
      advances: 'Alınan Avanslar',
      remaining: 'Kalan Ödeme',
      history: 'Ödeme Geçmişi',
      paySalary: 'Maaş Öde',
      giveAdvance: 'Avans Ver',
      save: 'KAYDET',
      cancel: 'İPTAL',
      roles: ['Şef', 'Garson', 'Mutfak', 'Komi', 'Barista', 'Temizlik'],
      type: { salary: 'Maaş Ödemesi', advance: 'Avans' },
      paid: 'ÖDENDİ',
      recordsHeader: 'Sicil & Kayıt Bilgileri',
      noRecords: 'Kayıt Bulunmuyor',
      deleteRecord: 'KAYDI SİL',
      deleteConfirm: 'Kayıt silinsin mi?',
      errorName: 'Lütfen en azından ad ve soyad girin.'
    },
    de: {
      title: 'Personalverwaltung',
      count: 'Mitarbeiter',
      add: 'Neuer Mitarbeiter',
      search: 'Name oder Position...',
      personalInfo: 'Persönliche Daten',
      legalInfo: 'Gesetzliche Informationen',
      bankInfo: 'Bankverbindung',
      salaryInfo: 'Gehaltsstatus',
      firstName: 'Vorname',
      lastName: 'Nachname',
      dob: 'Geburtsdatum',
      pob: 'Geburtsort',
      address: 'Anschrift',
      nationality: 'Staatsangehörigkeit',
      healthIns: 'Krankkasse',
      taxId: 'Steuer ID',
      ssn: 'Sozialversicherungsnummer',
      bank: 'Bankname',
      iban: 'IBAN',
      bic: 'BIC',
      startDate: 'Eintrittsdatum',
      endDate: 'Austrittsdatum',
      baseSalary: 'Monatsgehalt Netto',
      advances: 'Vorschüsse',
      remaining: 'Restzahlung',
      history: 'Zahlungsverlauf',
      paySalary: 'Gehalt zahlen',
      giveAdvance: 'Vorschuss geben',
      save: 'SPEICHERN',
      cancel: 'ABBRECHEN',
      roles: ['Küchenchef', 'Kellner', 'Küche', 'Hilfskraft', 'Barista', 'Reinigung'],
      type: { salary: 'Gehaltszahlung', advance: 'Vorschuss' },
      paid: 'BEZAHLT',
      recordsHeader: 'Stamm- & Registerdaten',
      noRecords: 'Keine Einträge',
      deleteRecord: 'DATENSATZ LÖSCHEN',
      deleteConfirm: 'Datensatz löschen?',
      errorName: 'Bitte Vor- und Nachnamen eingeben.'
    },
    en: {
      title: 'Staff Management',
      count: 'Staff Count',
      add: 'Add New Staff',
      search: 'Search staff...',
      personalInfo: 'Personal Info',
      legalInfo: 'Legal Info',
      bankInfo: 'Bank Account',
      salaryInfo: 'Salary Info',
      firstName: 'First Name',
      lastName: 'Last Name',
      dob: 'Date of Birth',
      pob: 'Place of Birth',
      address: 'Address',
      nationality: 'Nationality',
      healthIns: 'Health Insurance',
      taxId: 'Tax ID',
      ssn: 'Social Security No',
      bank: 'Bank Name',
      iban: 'IBAN',
      bic: 'BIC',
      startDate: 'Start Date',
      endDate: 'End Date',
      baseSalary: 'Monthly Net Salary',
      advances: 'Advances',
      remaining: 'Remaining',
      history: 'History',
      paySalary: 'Pay Salary',
      giveAdvance: 'Give Advance',
      save: 'SAVE',
      cancel: 'CANCEL',
      roles: ['Chef', 'Waiter', 'Kitchen', 'Assistant', 'Barista', 'Cleaning'],
      type: { salary: 'Salary', advance: 'Advance' },
      paid: 'PAID',
      recordsHeader: 'Service & Record Info',
      noRecords: 'No Records Found',
      deleteRecord: 'DELETE RECORD',
      deleteConfirm: 'Delete this record?',
      errorName: 'Please enter at least first and last name.'
    }
  };

  const t = translations[lang] || translations.tr;

  const [staff, setStaff] = useState<Personnel[]>([
    { 
      id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', role: t.roles[0], phone: '0176 1234567', startDate: '2023-01-15',
      dateOfBirth: '1990-05-20', placeOfBirth: 'İstanbul', address: 'Musterstr. 1, 35510 Butzbach', nationality: 'TR',
      healthInsurance: 'AOK Hessen', taxId: '123/456/78901', socialSecurityNumber: '65 200590 Y 001', bankName: 'Sparkasse Oberhessen',
      iban: 'DE12 5005 0000 1234 5678 90', bic: 'HELADEF1', baseSalary: 2800,
      payments: [
        { id: 'p1', type: 'advance', amount: 300, date: '2024-03-05', month: '2024-03' }
      ]
    }
  ]);

  const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
    role: t.roles[0],
    startDate: new Date().toISOString().split('T')[0],
    payments: [],
    baseSalary: 0
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  const filteredStaff = useMemo(() => {
    return staff.filter(person => 
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const salaryStats = useMemo(() => {
    if (!selectedPersonnel) return { totalAdvances: 0, remaining: 0, paidSalary: false };
    const monthlyPayments = selectedPersonnel.payments.filter(p => p.month === currentMonth);
    const totalAdvances = monthlyPayments.filter(p => p.type === 'advance').reduce((s, p) => s + p.amount, 0);
    const paidSalary = monthlyPayments.some(p => p.type === 'salary');
    const remaining = paidSalary ? 0 : selectedPersonnel.baseSalary - totalAdvances;
    return { totalAdvances, remaining, paidSalary };
  }, [selectedPersonnel, currentMonth]);

  const handleSaveNewPersonnel = () => {
    if (!newPerson.firstName || !newPerson.lastName) {
      alert(t.errorName);
      return;
    }
    const personToAdd = {
      ...newPerson,
      id: Math.random().toString(36).substr(2, 9),
      payments: [],
      baseSalary: Number(newPerson.baseSalary) || 0
    } as Personnel;
    setStaff([...staff, personToAdd]);
    setShowAddForm(false);
    setNewPerson({ role: t.roles[0], startDate: new Date().toISOString().split('T')[0], baseSalary: 0 });
  };

  const handleAddPayment = () => {
    if (!selectedPersonnel || !paymentAmount || !showPaymentModal) return;
    const newPayment: PersonnelPayment = {
      id: Math.random().toString(36).substr(2, 9),
      type: showPaymentModal,
      amount: parseFloat(paymentAmount),
      date: new Date().toISOString().split('T')[0],
      month: currentMonth
    };
    const updatedStaff = staff.map(s => s.id === selectedPersonnel.id ? { ...s, payments: [newPayment, ...s.payments] } : s);
    setStaff(updatedStaff);
    setSelectedPersonnel({ ...selectedPersonnel, payments: [newPayment, ...selectedPersonnel.payments] });
    setShowPaymentModal(null);
    setPaymentAmount('');
  };

  if (showAddForm) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase">{t.add}</h2>
          <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full text-white/40"><X size={20} /></button>
        </div>

        <div className="space-y-8">
          <section className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <Users size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.personalInfo}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.firstName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.firstName || ''} onChange={e => setNewPerson({...newPerson, firstName: e.target.value})}/>
              <input placeholder={t.lastName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.lastName || ''} onChange={e => setNewPerson({...newPerson, lastName: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-white/30 font-black uppercase ml-2">{t.dob}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.dateOfBirth || ''} onChange={e => setNewPerson({...newPerson, dateOfBirth: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/30 font-black uppercase ml-2">{t.pob}</label>
                <input placeholder={t.pob} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.placeOfBirth || ''} onChange={e => setNewPerson({...newPerson, placeOfBirth: e.target.value})}/>
              </div>
            </div>
            <input placeholder={t.address} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.address || ''} onChange={e => setNewPerson({...newPerson, address: e.target.value})}/>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.nationality} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.nationality || ''} onChange={e => setNewPerson({...newPerson, nationality: e.target.value})}/>
              <input placeholder={t.phone} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.phone || ''} onChange={e => setNewPerson({...newPerson, phone: e.target.value})}/>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <ShieldCheck size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.legalInfo}</h3>
            </div>
            <input placeholder={t.healthIns} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.healthInsurance || ''} onChange={e => setNewPerson({...newPerson, healthInsurance: e.target.value})}/>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.taxId} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.taxId || ''} onChange={e => setNewPerson({...newPerson, taxId: e.target.value})}/>
              <input placeholder={t.ssn} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.socialSecurityNumber || ''} onChange={e => setNewPerson({...newPerson, socialSecurityNumber: e.target.value})}/>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <Banknote size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.bankInfo}</h3>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-primary font-black uppercase ml-2">{t.baseSalary} (€)</label>
              <input type="number" placeholder="0.00" className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 px-4 text-white font-black text-2xl" value={newPerson.baseSalary || ''} onChange={e => setNewPerson({...newPerson, baseSalary: Number(e.target.value)})}/>
            </div>
            <input placeholder={t.bank} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bankName || ''} onChange={e => setNewPerson({...newPerson, bankName: e.target.value})}/>
            <input placeholder={t.iban} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold font-mono" value={newPerson.iban || ''} onChange={e => setNewPerson({...newPerson, iban: e.target.value})}/>
            <input placeholder={t.bic} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bic || ''} onChange={e => setNewPerson({...newPerson, bic: e.target.value})}/>
          </section>

          <section className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <Calendar size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.startDate} / {t.endDate}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.startDate || ''} onChange={e => setNewPerson({...newPerson, startDate: e.target.value})}/>
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.endDate || ''} onChange={e => setNewPerson({...newPerson, endDate: e.target.value})}/>
            </div>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark]" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})}>
               {t.roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </section>

          <button onClick={handleSaveNewPersonnel} className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">
            {t.save}
          </button>
        </div>
      </div>
    );
  }

  if (selectedPersonnel) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedPersonnel(null)} className="p-2 bg-white/5 rounded-full text-white/40"><X size={20} /></button>
          <h2 className="text-xl font-black text-white uppercase">{selectedPersonnel.firstName} {selectedPersonnel.lastName}</h2>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet size={120} className="text-white" /></div>
           <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{t.baseSalary} ({currentMonth})</p>
                <h3 className="text-4xl font-black text-white">€{selectedPersonnel.baseSalary}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">{t.advances}</p>
                    <p className="text-xl font-black text-white">€{salaryStats.totalAdvances}</p>
                 </div>
                 <div className={`p-4 rounded-3xl border ${salaryStats.paidSalary ? 'bg-green-500/10 border-green-500/20' : 'bg-primary/5 border-primary/20'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${salaryStats.paidSalary ? 'text-green-500' : 'text-primary'}`}>
                      {salaryStats.paidSalary ? t.paid : t.remaining}
                    </p>
                    <p className="text-xl font-black text-white">€{salaryStats.remaining}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => { setShowPaymentModal('advance'); setPaymentAmount(''); }} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">{t.giveAdvance}</button>
                 {!salaryStats.paidSalary && (
                   <button onClick={() => { setShowPaymentModal('salary'); setPaymentAmount(salaryStats.remaining.toString()); }} className="flex-1 bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">{t.paySalary}</button>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <Info size={16} className="text-white/30" />
              <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.recordsHeader}</h3>
           </div>
           <div className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
              <div className="grid grid-cols-1 gap-y-3">
                 {[
                   { label: t.firstName, val: selectedPersonnel.firstName, icon: <Users size={14}/> },
                   { label: t.lastName, val: selectedPersonnel.lastName, icon: <Users size={14}/> },
                   { label: t.dob, val: selectedPersonnel.dateOfBirth, icon: <Calendar size={14}/> },
                   { label: t.pob, val: selectedPersonnel.placeOfBirth, icon: <MapPin size={14}/> },
                   { label: t.nationality, val: selectedPersonnel.nationality, icon: <Globe size={14}/> },
                   { label: t.address, val: selectedPersonnel.address, icon: <MapPin size={14}/> },
                   { label: t.healthIns, val: selectedPersonnel.healthInsurance, icon: <Activity size={14}/> },
                   { label: t.taxId, val: selectedPersonnel.taxId, icon: <Fingerprint size={14}/> },
                   { label: t.ssn, val: selectedPersonnel.socialSecurityNumber, icon: <ShieldCheck size={14}/> },
                   { label: t.bank, val: selectedPersonnel.bankName, icon: <Landmark size={14}/> },
                   { label: t.iban, val: selectedPersonnel.iban, icon: <CreditCard size={14}/> },
                   { label: t.bic, val: selectedPersonnel.bic, icon: <CreditCard size={14}/> },
                   { label: t.startDate, val: selectedPersonnel.startDate, icon: <Calendar size={14}/> },
                   { label: t.endDate, val: selectedPersonnel.endDate || '-', icon: <Calendar size={14}/> },
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                      <div className="flex items-center gap-2 opacity-30">
                        {item.icon}
                        <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-white text-right max-w-[180px] truncate">{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <History size={16} className="text-white/30" />
              <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.history}</h3>
           </div>
           <div className="space-y-2">
              {selectedPersonnel.payments.length === 0 ? (
                <p className="text-center py-8 text-white/10 text-xs font-bold uppercase tracking-widest">{t.noRecords}</p>
              ) : (
                selectedPersonnel.payments.map(payment => (
                  <div key={payment.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${payment.type === 'salary' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'}`}>
                           {payment.type === 'salary' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase tracking-tight">{payment.type === 'salary' ? t.type.salary : t.type.advance}</p>
                           <p className="text-[9px] text-white/30 font-black uppercase">{payment.date} • {payment.month}</p>
                        </div>
                     </div>
                     <p className={`font-black ${payment.type === 'salary' ? 'text-green-500' : 'text-orange-400'}`}>
                       {payment.type === 'salary' ? '' : '-'}€{payment.amount}
                     </p>
                  </div>
                ))
              )}
           </div>
        </div>

        <button onClick={() => { if(window.confirm(t.deleteConfirm)) { setStaff(staff.filter(s => s.id !== selectedPersonnel.id)); setSelectedPersonnel(null); } }} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20">{t.deleteRecord}</button>

        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="w-full max-w-xs glass p-8 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl">
                <div className="text-center">
                   <h3 className="text-white font-black uppercase tracking-widest text-sm">{showPaymentModal === 'salary' ? t.paySalary : t.giveAdvance}</h3>
                   <p className="text-white/30 text-[10px] mt-1 uppercase font-bold">{currentMonth}</p>
                </div>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl">€</span>
                   <input autoFocus type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-10 pr-4 text-white text-3xl font-black text-center focus:ring-1 focus:ring-primary outline-none" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}/>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowPaymentModal(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-white/40">{t.cancel}</button>
                   <button onClick={handleAddPayment} className="flex-1 bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">{t.save}</button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{t.title}</h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{t.count}: {staff.length}</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-primary p-3 rounded-2xl text-black shadow-lg shadow-primary/20 active:scale-90 transition-all">
          <UserPlus size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input type="text" placeholder={t.search} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="space-y-3">
        {filteredStaff.map(person => (
          <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-primary border border-white/5 font-black text-xl">{person.firstName.charAt(0)}</div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{person.firstName} {person.lastName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase">{person.role}</span>
                  <span className="text-[9px] text-green-500 font-black bg-green-500/10 px-2 py-0.5 rounded-md uppercase">€{person.baseSalary}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-white/20 group-hover:text-primary transition-colors" size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonnelManagement;
