import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, UserPlus, Search, X, ChevronRight, CreditCard, 
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

  const translations: Record<Language, any> = {
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
    },
    es: {
      title: 'Gestión de Personal',
      count: 'Número de empleados',
      add: 'Nuevo Empleado',
      search: 'Buscar...',
      personalInfo: 'Info Personal',
      legalInfo: 'Info Legal',
      bankInfo: 'Info Bancaria',
      salaryInfo: 'Estado Salario',
      firstName: 'Nombre',
      lastName: 'Apellido',
      dob: 'Fecha de Nac.',
      pob: 'Lugar de Nac.',
      address: 'Dirección',
      nationality: 'Nacionalidad',
      healthIns: 'Seguro Médico',
      taxId: 'ID Fiscal',
      ssn: 'No. Seguridad Social',
      bank: 'Banco',
      iban: 'IBAN',
      bic: 'BIC',
      startDate: 'Fecha Inicio',
      endDate: 'Fecha Fin',
      baseSalary: 'Salario Neto',
      advances: 'Adelantos',
      remaining: 'Restante',
      history: 'Historial',
      paySalary: 'Pagar Salario',
      giveAdvance: 'Dar Adelanto',
      save: 'GUARDAR',
      cancel: 'CANCELAR',
      roles: ['Chef', 'Camarero', 'Cocina', 'Asistente', 'Barista', 'Limpieza'],
      type: { salary: 'Salario', advance: 'Adelanto' },
      paid: 'PAGADO',
      recordsHeader: 'Registro de Servicio',
      noRecords: 'Sin registros',
      deleteRecord: 'ELIMINAR REGISTRO',
      deleteConfirm: '¿Eliminar registro?',
      errorName: 'Ingrese nombre y apellido.'
    }
  };

  const t = translations[lang] || translations.tr;

  const [staff, setStaff] = useState<Personnel[]>([
    { 
      id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', role: t.roles[0], phone: '0176 1234567', startDate: '2023-01-15',
      dateOfBirth: '1990-05-20', placeOfBirth: 'İstanbul', address: 'Musterstr. 1, 35510 Butzbach', nationality: 'TR',
      healthInsurance: 'AOK Hessen', taxId: '123/456/78901', socialSecurityNumber: '65 200590 Y 001', bankName: 'Sparkasse Oberhessen',
      iban: 'DE12 5005 0000 1234 5678 90', bic: 'HELADEF1', baseSalary: 2800,
      payments: []
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
    return staff.filter((person: Personnel) => 
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const salaryStats = useMemo(() => {
    if (!selectedPersonnel) return { totalAdvances: 0, remaining: 0, paidSalary: false };
    const monthlyPayments = selectedPersonnel.payments.filter((p: PersonnelPayment) => p.month === currentMonth);
    const totalAdvances = monthlyPayments.filter((p: PersonnelPayment) => p.type === 'advance').reduce((s: number, p: PersonnelPayment) => s + p.amount, 0);
    const paidSalary = monthlyPayments.some((p: PersonnelPayment) => p.type === 'salary');
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
    const updatedStaff = staff.map((s: Personnel) => s.id === selectedPersonnel.id ? { ...s, payments: [newPayment, ...s.payments] } : s);
    setStaff(updatedStaff);
    setSelectedPersonnel({ ...selectedPersonnel, payments: [newPayment, ...selectedPersonnel.payments] });
    setShowPaymentModal(null);
  };

  if (showAddForm) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase">{t.add}</h2>
          <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-8">
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary/60">{t.personalInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.firstName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.firstName || ''} onChange={e => setNewPerson({...newPerson, firstName: e.target.value})}/>
              <input placeholder={t.lastName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.lastName || ''} onChange={e => setNewPerson({...newPerson, lastName: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.dateOfBirth || ''} onChange={e => setNewPerson({...newPerson, dateOfBirth: e.target.value})}/>
              <input placeholder={t.pob} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.placeOfBirth || ''} onChange={e => setNewPerson({...newPerson, placeOfBirth: e.target.value})}/>
            </div>
          </section>
          <button onClick={handleSaveNewPersonnel} className="w-full bg-primary text-black py-6 rounded-3xl font-black">{t.save}</button>
        </div>
      </div>
    );
  }

  if (selectedPersonnel) {
    return (
      <div className="space-y-6 pb-24 animate-in zoom-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedPersonnel(null)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
          <h2 className="text-xl font-black text-white uppercase">{selectedPersonnel.firstName} {selectedPersonnel.lastName}</h2>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-[2.5rem] border border-white/10 relative">
           <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{t.baseSalary}</p>
                <h3 className="text-4xl font-black text-white">€{selectedPersonnel.baseSalary}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">{t.advances}</p>
                    <p className="text-xl font-black text-white">€{salaryStats.totalAdvances}</p>
                 </div>
                 <div className="bg-primary/5 p-4 rounded-3xl border border-primary/20">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${salaryStats.paidSalary ? 'text-green-500' : 'text-primary'}`}>{salaryStats.paidSalary ? t.paid : t.remaining}</p>
                    <p className="text-xl font-black text-white">€{salaryStats.remaining}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowPaymentModal('advance')} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-white">{t.giveAdvance}</button>
                 {!salaryStats.paidSalary && <button onClick={() => setShowPaymentModal('salary')} className="flex-1 bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase">{t.paySalary}</button>}
              </div>
           </div>
        </div>
        <div className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
          <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.recordsHeader}</h3>
          <div className="grid grid-cols-1 gap-y-3">
             {[
               { label: t.firstName, val: selectedPersonnel.firstName, icon: <Users size={14}/> },
               { label: t.lastName, val: selectedPersonnel.lastName, icon: <Users size={14}/> },
               { label: t.healthIns, val: selectedPersonnel.healthInsurance, icon: <Activity size={14}/> },
               { label: t.taxId, val: selectedPersonnel.taxId, icon: <Fingerprint size={14}/> },
               { label: t.ssn, val: selectedPersonnel.socialSecurityNumber, icon: <ShieldCheck size={14}/> }
             ].map((item: any, idx: number) => (
               <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                  <div className="flex items-center gap-2 opacity-30">{item.icon}<span className="text-[9px] font-black uppercase">{item.label}</span></div>
                  <span className="text-xs font-bold text-white">{item.val}</span>
               </div>
             ))}
          </div>
        </div>
        <button onClick={() => { if(window.confirm(t.deleteConfirm)) { setStaff(staff.filter((s: Personnel) => s.id !== selectedPersonnel.id)); setSelectedPersonnel(null); } }} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase border border-red-500/20">{t.deleteRecord}</button>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
             <div className="w-full max-w-xs glass p-8 rounded-[3rem] border border-white/10 space-y-6">
                <div className="text-center">
                   <h3 className="text-white font-black uppercase tracking-widest text-sm">{showPaymentModal === 'salary' ? t.paySalary : t.giveAdvance}</h3>
                </div>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-white text-3xl font-black text-center" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}/>
                <div className="flex gap-3">
                   <button onClick={() => setShowPaymentModal(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-white/40">{t.cancel}</button>
                   <button onClick={handleAddPayment} className="flex-1 bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase">{t.save}</button>
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
        <button onClick={() => setShowAddForm(true)} className="bg-primary p-3 rounded-2xl text-black">
          <UserPlus size={24} />
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input type="text" placeholder={t.search} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className="space-y-3">
        {filteredStaff.map((person: Personnel) => (
          <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-primary font-black text-xl">{person.firstName.charAt(0)}</div>
              <div>
                <h3 className="text-white font-bold text-lg">{person.firstName} {person.lastName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase">{person.role}</span>
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