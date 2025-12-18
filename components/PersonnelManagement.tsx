
import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, UserPlus, Search, X, ChevronRight, CreditCard, 
  Landmark, Fingerprint, Banknote, History, Wallet, CheckCircle2, AlertCircle,
  MapPin, Globe, Activity, ShieldCheck, Info, Briefcase, Hash, Building2,
  // Added missing User icon component
  User
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
      employmentInfo: 'İş & Sözleşme Bilgileri',
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
      errorName: 'Lütfen ad ve soyad girin.'
    },
    de: {
      title: 'Personalverwaltung',
      count: 'Mitarbeiter',
      add: 'Neuer Mitarbeiter',
      search: 'Name oder Position...',
      personalInfo: 'Persönliche Daten',
      legalInfo: 'Gesetzliche Informationen',
      bankInfo: 'Bankverbindung',
      employmentInfo: 'Arbeitsverhältnis',
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
      employmentInfo: 'Employment Info',
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
      errorName: 'Please enter first and last name.'
    }
  };

  const t = translations[lang] || translations.de;

  const [staff, setStaff] = useState<Personnel[]>([
    { 
      id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', role: t.roles[0], phone: '0176 1234567', startDate: '2023-01-15',
      dateOfBirth: '1990-05-20', placeOfBirth: 'İstanbul', address: 'Marktplatz 23, 35510 Butzbach', nationality: 'TR',
      healthInsurance: 'AOK Hessen', taxId: '123/456/78901', socialSecurityNumber: '65 200590 Y 001', bankName: 'Sparkasse Oberhessen',
      iban: 'DE12 5005 0000 1234 5678 90', bic: 'HELADEF1', baseSalary: 2800,
      payments: []
    }
  ]);

  const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
    firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', address: '',
    nationality: '', healthInsurance: '', taxId: '', socialSecurityNumber: '',
    bankName: '', iban: '', bic: '', startDate: new Date().toISOString().split('T')[0],
    endDate: '', role: t.roles[0], baseSalary: 0, payments: []
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
    // Reset form
    setNewPerson({
      firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', address: '',
      nationality: '', healthInsurance: '', taxId: '', socialSecurityNumber: '',
      bankName: '', iban: '', bic: '', startDate: new Date().toISOString().split('T')[0],
      endDate: '', role: t.roles[0], baseSalary: 0, payments: []
    });
  };

  const handleAddPayment = () => {
    if (!selectedPersonnel || !paymentAmount || !showPaymentModal) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newPayment: PersonnelPayment = {
      id: Math.random().toString(36).substr(2, 9),
      type: showPaymentModal,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      month: currentMonth
    };
    const updatedStaff = staff.map((s: Personnel) => s.id === selectedPersonnel.id ? { ...s, payments: [newPayment, ...s.payments] } : s);
    setStaff(updatedStaff);
    setSelectedPersonnel({ ...selectedPersonnel, payments: [newPayment, ...selectedPersonnel.payments] });
    setShowPaymentModal(null);
    setPaymentAmount('');
  };

  if (showAddForm) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase">{t.add}</h2>
          <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="space-y-6">
          {/* Bölüm 1: Kişisel Bilgiler */}
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
              <User size={14}/> {t.personalInfo}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.firstName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.firstName} onChange={e => setNewPerson({...newPerson, firstName: e.target.value})}/>
              <input placeholder={t.lastName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.lastName} onChange={e => setNewPerson({...newPerson, lastName: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-white/30 uppercase ml-2">{t.dob}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.dateOfBirth} onChange={e => setNewPerson({...newPerson, dateOfBirth: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-white/30 uppercase ml-2">{t.pob}</label>
                <input placeholder={t.pob} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.placeOfBirth} onChange={e => setNewPerson({...newPerson, placeOfBirth: e.target.value})}/>
              </div>
            </div>
            <input placeholder={t.address} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.address} onChange={e => setNewPerson({...newPerson, address: e.target.value})}/>
            <input placeholder={t.nationality} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.nationality} onChange={e => setNewPerson({...newPerson, nationality: e.target.value})}/>
          </section>

          {/* Bölüm 2: Yasal Bilgiler */}
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
              <ShieldCheck size={14}/> {t.legalInfo}
            </h3>
            <input placeholder={t.healthIns} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.healthInsurance} onChange={e => setNewPerson({...newPerson, healthInsurance: e.target.value})}/>
            <input placeholder={t.taxId} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.taxId} onChange={e => setNewPerson({...newPerson, taxId: e.target.value})}/>
            <input placeholder={t.ssn} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.socialSecurityNumber} onChange={e => setNewPerson({...newPerson, socialSecurityNumber: e.target.value})}/>
          </section>

          {/* Bölüm 3: Banka Bilgileri */}
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
              <Building2 size={14}/> {t.bankInfo}
            </h3>
            <input placeholder={t.bank} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bankName} onChange={e => setNewPerson({...newPerson, bankName: e.target.value})}/>
            <input placeholder={t.iban} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.iban} onChange={e => setNewPerson({...newPerson, iban: e.target.value})}/>
            <input placeholder={t.bic} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bic} onChange={e => setNewPerson({...newPerson, bic: e.target.value})}/>
          </section>

          {/* Bölüm 4: İş Bilgileri */}
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
              <Briefcase size={14}/> {t.employmentInfo}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-white/30 uppercase ml-2">{t.startDate}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.startDate} onChange={e => setNewPerson({...newPerson, startDate: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-white/30 uppercase ml-2">{t.endDate}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white [color-scheme:dark]" value={newPerson.endDate} onChange={e => setNewPerson({...newPerson, endDate: e.target.value})}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark]" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})}>
                {t.roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="number" placeholder={t.baseSalary} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.baseSalary || ''} onChange={e => setNewPerson({...newPerson, baseSalary: Number(e.target.value)})}/>
            </div>
          </section>

          <button onClick={handleSaveNewPersonnel} className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">
            {t.save}
          </button>
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

        {/* Maaş & Ödeme Özeti */}
        <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 p-6 rounded-[2.5rem] border border-white/10 relative shadow-xl">
           <div className="relative z-10 space-y-6">
              <div>
                <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">{t.baseSalary}</p>
                <h3 className="text-5xl font-black text-black tracking-tighter">€{selectedPersonnel.baseSalary.toLocaleString()}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/5 p-4 rounded-3xl border border-black/5 backdrop-blur-md">
                    <p className="text-[9px] font-black text-black/60 uppercase tracking-widest mb-1">{t.advances}</p>
                    <p className="text-xl font-black text-black">€{salaryStats.totalAdvances.toLocaleString()}</p>
                 </div>
                 <div className="bg-black/10 p-4 rounded-3xl border border-black/10 backdrop-blur-md">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${salaryStats.paidSalary ? 'text-green-800' : 'text-black/60'}`}>{salaryStats.paidSalary ? t.paid : t.remaining}</p>
                    <p className="text-xl font-black text-black">€{salaryStats.remaining.toLocaleString()}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowPaymentModal('advance')} className="flex-1 bg-black/10 border border-black/5 py-4 rounded-2xl text-[10px] font-black uppercase text-black">{t.giveAdvance}</button>
                 {!salaryStats.paidSalary && <button onClick={() => setShowPaymentModal('salary')} className="flex-1 bg-black text-primary py-4 rounded-2xl text-[10px] font-black uppercase">{t.paySalary}</button>}
              </div>
           </div>
        </div>

        {/* Tüm Detaylı Bilgiler */}
        <div className="space-y-4">
           {/* Kişisel Bölüm */}
           <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-2 mb-2"><User size={12}/> {t.personalInfo}</h3>
              <div className="grid grid-cols-1 gap-y-2.5">
                {[
                  { label: t.firstName, val: selectedPersonnel.firstName },
                  { label: t.lastName, val: selectedPersonnel.lastName },
                  { label: t.dob, val: selectedPersonnel.dateOfBirth },
                  { label: t.pob, val: selectedPersonnel.placeOfBirth },
                  { label: t.address, val: selectedPersonnel.address },
                  { label: t.nationality, val: selectedPersonnel.nationality },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <span className="text-[9px] font-black uppercase text-white/30">{item.label}</span>
                    <span className="text-xs font-bold text-white">{item.val || '-'}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Resmi Bölüm */}
           <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-2 mb-2"><ShieldCheck size={12}/> {t.legalInfo}</h3>
              <div className="grid grid-cols-1 gap-y-2.5">
                {[
                  { label: t.healthIns, val: selectedPersonnel.healthInsurance },
                  { label: t.taxId, val: selectedPersonnel.taxId },
                  { label: t.ssn, val: selectedPersonnel.socialSecurityNumber },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <span className="text-[9px] font-black uppercase text-white/30">{item.label}</span>
                    <span className="text-xs font-bold text-white">{item.val || '-'}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Banka Bölümü */}
           <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-2 mb-2"><Landmark size={12}/> {t.bankInfo}</h3>
              <div className="grid grid-cols-1 gap-y-2.5">
                {[
                  { label: t.bank, val: selectedPersonnel.bankName },
                  { label: t.iban, val: selectedPersonnel.iban },
                  { label: t.bic, val: selectedPersonnel.bic },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <span className="text-[9px] font-black uppercase text-white/30">{item.label}</span>
                    <span className="text-xs font-bold text-white break-all text-right ml-4">{item.val || '-'}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* İş Bölümü */}
           <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-2 mb-2"><Briefcase size={12}/> {t.employmentInfo}</h3>
              <div className="grid grid-cols-1 gap-y-2.5">
                {[
                  { label: t.startDate, val: selectedPersonnel.startDate },
                  { label: t.endDate, val: selectedPersonnel.endDate },
                  { label: 'Role', val: selectedPersonnel.role },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <span className="text-[9px] font-black uppercase text-white/30">{item.label}</span>
                    <span className="text-xs font-bold text-white">{item.val || '-'}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <button onClick={() => { if(window.confirm(t.deleteConfirm)) { setStaff(staff.filter((s: Personnel) => s.id !== selectedPersonnel.id)); setSelectedPersonnel(null); } }} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase border border-red-500/20 active:bg-red-500/20 transition-all">{t.deleteRecord}</button>

        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
             <div className="w-full max-w-xs glass p-8 rounded-[3rem] border border-white/10 space-y-6 animate-in zoom-in duration-200">
                <div className="text-center">
                   <h3 className="text-white font-black uppercase tracking-widest text-sm">{showPaymentModal === 'salary' ? t.paySalary : t.giveAdvance}</h3>
                </div>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-white text-3xl font-black text-center focus:outline-none focus:border-primary" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} autoFocus placeholder="0"/>
                <div className="flex gap-3">
                   <button onClick={() => { setShowPaymentModal(null); setPaymentAmount(''); }} className="flex-1 py-4 text-[10px] font-black uppercase text-white/40">{t.cancel}</button>
                   <button onClick={handleAddPayment} className="flex-1 bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-primary/20">{t.save}</button>
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
        <button onClick={() => setShowAddForm(true)} className="bg-primary p-3 rounded-2xl text-black shadow-lg shadow-primary/10 active:scale-90 transition-all">
          <UserPlus size={24} />
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input type="text" placeholder={t.search} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-primary/50 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className="space-y-3">
        {filteredStaff.map((person: Personnel) => (
          <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary font-black text-xl border border-white/5">{person.firstName.charAt(0)}</div>
              <div>
                <h3 className="text-white font-bold text-lg">{person.firstName} {person.lastName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase border border-primary/10">{person.role}</span>
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
