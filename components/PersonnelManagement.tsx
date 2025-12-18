
import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, Calendar, UserPlus, Search, X, ChevronRight, CreditCard, 
  History, Wallet, CheckCircle2, AlertCircle, Camera, User,
  ShieldCheck, Briefcase, Building2, Image as ImageIcon, MapPin,
  Landmark, Hash, BadgeCheck, Plus, ArrowUpRight, ArrowDownRight,
  Banknote
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<Language, any> = {
    tr: {
      title: 'Personel Yönetimi', count: 'Çalışan', add: 'Yeni Kayıt', search: 'İsim veya görev...',
      personalInfo: 'Kişisel Bilgiler', legalInfo: 'Resmi Bilgiler', bankInfo: 'Banka Bilgileri',
      employmentInfo: 'İş Bilgileri', firstName: 'Adı', lastName: 'Soyadı', dob: 'Doğum Tarihi',
      pob: 'Doğum Yeri', address: 'Adres', nationality: 'Uyruk', healthIns: 'Krankkasse (Sağlık Sig.)',
      taxId: 'Steuer ID (Vergi No)', ssn: 'SSN (Sosyal Güvenlik)', bank: 'Banka Adı', iban: 'IBAN', bic: 'BIC/SWIFT',
      startDate: 'İşe Giriş Tarihi', baseSalary: 'Net Maaş', advances: 'Ödenen', remaining: 'Kalan',
      save: 'KAYDI TAMAMLA', cancel: 'İPTAL', roles: ['Şef', 'Garson', 'Mutfak', 'Komi', 'Barista', 'Temizlik'],
      deleteConfirm: 'Bu personel kaydı silinsin mi?', photo: 'Profil Fotoğrafı',
      paySalary: 'Maaş Öde', giveAdvance: 'Avans Ver', paymentHistory: 'Ödeme Geçmişi',
      type: { salary: 'Maaş', advance: 'Avans' }, paid: 'ÖDENDİ', addPayment: 'Ödeme Ekle'
    },
    de: {
      title: 'Personal', count: 'Mitarbeiter', add: 'Neu anlegen', search: 'Name oder Position...',
      personalInfo: 'Persönliche Daten', legalInfo: 'Gesetzliche Informationen', bankInfo: 'Bankverbindung',
      employmentInfo: 'Arbeitsverhältnis', firstName: 'Vorname', lastName: 'Nachname', dob: 'Geburtsdatum',
      pob: 'Geburtsort', address: 'Anschrift', nationality: 'Staatsangehörigkeit', healthIns: 'Krankkasse',
      taxId: 'Steuer ID', ssn: 'Sozialvers.Nr.', bank: 'Bankname', iban: 'IBAN', bic: 'BIC',
      startDate: 'Eintrittsdatum', baseSalary: 'Netto-Gehalt', advances: 'Gezahlt', remaining: 'Rest',
      save: 'REGISTRIERUNG ABSCHLIESSEN', cancel: 'ABBRECHEN', roles: ['Küchenchef', 'Kellner', 'Küche', 'Hilfskraft', 'Barista', 'Reinigung'],
      deleteConfirm: 'Mitarbeiter wirklich löschen?', photo: 'Profilbild',
      paySalary: 'Gehalt zahlen', giveAdvance: 'Vorschuss geben', paymentHistory: 'Zahlungshistorie',
      type: { salary: 'Gehalt', advance: 'Vorschuss' }, paid: 'BEZAHLT', addPayment: 'Zahlung erfassen'
    },
    en: {
      title: 'Staff', count: 'Staff Count', add: 'Add Staff', search: 'Search staff...',
      personalInfo: 'Personal Info', legalInfo: 'Legal Information', bankInfo: 'Bank Details',
      employmentInfo: 'Employment Details', firstName: 'First Name', lastName: 'Last Name', dob: 'Date of Birth',
      pob: 'Place of Birth', address: 'Address', nationality: 'Nationality', healthIns: 'Health Insurance',
      taxId: 'Tax ID', ssn: 'SSN (Social Security)', bank: 'Bank Name', iban: 'IBAN', bic: 'BIC',
      startDate: 'Start Date', baseSalary: 'Net Salary', advances: 'Paid', remaining: 'Remaining',
      save: 'COMPLETE REGISTRATION', cancel: 'CANCEL', roles: ['Chef', 'Waiter', 'Kitchen', 'Assistant', 'Barista', 'Cleaning'],
      deleteConfirm: 'Delete this staff record?', photo: 'Profile Photo',
      paySalary: 'Pay Salary', giveAdvance: 'Give Advance', paymentHistory: 'Payment History',
      type: { salary: 'Salary', advance: 'Advance' }, paid: 'PAID', addPayment: 'Add Payment'
    }
  };

  const t = translations[lang] || translations.de;

  const [staff, setStaff] = useState<Personnel[]>([
    { 
      id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', role: t.roles[0], phone: '0176 1234567', startDate: '2023-01-15',
      dateOfBirth: '1990-05-20', placeOfBirth: 'İstanbul', address: 'Marktplatz 23, 35510 Butzbach', nationality: 'TR',
      healthInsurance: 'AOK Hessen', taxId: '123/456/78901', socialSecurityNumber: '65 200590 Y 001', bankName: 'Sparkasse',
      iban: 'DE12 5005 0000 1234 5678 90', bic: 'HELADEF1', baseSalary: 2800, payments: []
    }
  ]);

  const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
    firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', address: '',
    nationality: '', healthInsurance: '', taxId: '', socialSecurityNumber: '',
    bankName: '', iban: '', bic: '', startDate: new Date().toISOString().split('T')[0],
    role: t.roles[0], baseSalary: 0, photo: undefined, phone: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewPerson({ ...newPerson, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAddPayment = () => {
    if (!selectedPersonnel || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const newPayment: PersonnelPayment = {
      id: Math.random().toString(),
      type: showPaymentModal as 'salary' | 'advance',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      month: new Date().toISOString().slice(0, 7)
    };

    const updatedStaff = staff.map(p => 
      p.id === selectedPersonnel.id 
        ? { ...p, payments: [...p.payments, newPayment] }
        : p
    );
    
    setStaff(updatedStaff);
    setSelectedPersonnel(updatedStaff.find(p => p.id === selectedPersonnel.id) || null);
    setShowPaymentModal(null);
    setPaymentAmount('');
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(person => 
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const calculateMonthlyStats = (p: Personnel) => {
    const monthlyPayments = p.payments.filter(pm => pm.month === currentMonth);
    const totalPaid = monthlyPayments.reduce((sum, pm) => sum + pm.amount, 0);
    const remaining = Math.max(0, p.baseSalary - totalPaid);
    return { totalPaid, remaining, isFullyPaid: remaining <= 0 };
  };

  if (showAddForm) {
    return (
      <div className="space-y-6 pb-24 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase">{t.add}</h2>
          <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex flex-col items-center mb-6">
           <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden relative">
             {newPerson.photo ? <img src={newPerson.photo} className="w-full h-full object-cover" alt="Staff" /> : <ImageIcon className="text-white/20" size={40} />}
             <div className="absolute bottom-2 right-2 p-2 bg-primary rounded-full text-black"><Camera size={16}/></div>
           </div>
           <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
           <p className="mt-2 text-[10px] font-black text-white/30 uppercase tracking-widest">{t.photo}</p>
        </div>
        
        <div className="space-y-6">
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><User size={14}/> {t.personalInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.firstName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.firstName} onChange={e => setNewPerson({...newPerson, firstName: e.target.value})}/>
              <input placeholder={t.lastName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.lastName} onChange={e => setNewPerson({...newPerson, lastName: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.dob}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark]" value={newPerson.dateOfBirth} onChange={e => setNewPerson({...newPerson, dateOfBirth: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.nationality}</label>
                <input placeholder={t.nationality} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.nationality} onChange={e => setNewPerson({...newPerson, nationality: e.target.value})}/>
              </div>
            </div>
            <input placeholder={t.pob} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.placeOfBirth} onChange={e => setNewPerson({...newPerson, placeOfBirth: e.target.value})}/>
            <input placeholder={t.address} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.address} onChange={e => setNewPerson({...newPerson, address: e.target.value})}/>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><ShieldCheck size={14}/> {t.legalInfo}</h3>
            <input placeholder={t.healthIns} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.healthInsurance} onChange={e => setNewPerson({...newPerson, healthInsurance: e.target.value})}/>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.taxId} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.taxId} onChange={e => setNewPerson({...newPerson, taxId: e.target.value})}/>
              <input placeholder={t.ssn} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.socialSecurityNumber} onChange={e => setNewPerson({...newPerson, socialSecurityNumber: e.target.value})}/>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Landmark size={14}/> {t.bankInfo}</h3>
            <input placeholder={t.bank} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bankName} onChange={e => setNewPerson({...newPerson, bankName: e.target.value})}/>
            <input placeholder={t.iban} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.iban} onChange={e => setNewPerson({...newPerson, iban: e.target.value})}/>
            <input placeholder={t.bic} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.bic} onChange={e => setNewPerson({...newPerson, bic: e.target.value})}/>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Briefcase size={14}/> {t.employmentInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.startDate}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark]" value={newPerson.startDate} onChange={e => setNewPerson({...newPerson, startDate: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.baseSalary}</label>
                <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.baseSalary || ''} onChange={e => setNewPerson({...newPerson, baseSalary: Number(e.target.value)})}/>
              </div>
            </div>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})}>
              {t.roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input placeholder={t.phone} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})}/>
          </section>

          <button 
            onClick={() => { setStaff([...staff, {...newPerson, id: Math.random().toString(), payments: []} as Personnel]); setShowAddForm(false); }}
            className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
          >
            {t.save}
          </button>
        </div>
      </div>
    );
  }

  if (selectedPersonnel) {
    const stats = calculateMonthlyStats(selectedPersonnel);
    return (
      <div className="space-y-6 pb-24 animate-in zoom-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedPersonnel(null)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
          <h2 className="text-xl font-black text-white uppercase">{selectedPersonnel.firstName} {selectedPersonnel.lastName}</h2>
        </div>

        <div className="flex justify-center mb-6">
           <div className="w-32 h-32 rounded-[2.5rem] border-4 border-primary/20 p-1 overflow-hidden">
              {selectedPersonnel.photo ? <img src={selectedPersonnel.photo} className="w-full h-full object-cover rounded-[2.2rem]" alt="Staff" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-[2.2rem] text-primary font-black text-4xl">{selectedPersonnel.firstName.charAt(0)}</div>}
           </div>
        </div>

        {/* --- SALARY & ADVANCE MANAGEMENT SECTION --- */}
        <section className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 p-6 rounded-[2.5rem] shadow-xl space-y-6">
           <div>
             <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">{t.baseSalary}</p>
             <h3 className="text-5xl font-black text-black tracking-tighter">€{selectedPersonnel.baseSalary.toLocaleString()}</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 p-4 rounded-3xl border border-black/5">
                <p className="text-black/60 text-[9px] font-black uppercase tracking-widest mb-1">{t.advances}</p>
                <p className="text-xl font-black text-black">€{stats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-black/10 p-4 rounded-3xl border border-black/10">
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${stats.isFullyPaid ? 'text-green-800' : 'text-black/60'}`}>
                  {stats.isFullyPaid ? t.paid : t.remaining}
                </p>
                <p className="text-xl font-black text-black">€{stats.remaining.toLocaleString()}</p>
              </div>
           </div>

           <div className="flex gap-2">
              <button 
                onClick={() => setShowPaymentModal('salary')}
                className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Banknote size={14}/> {t.paySalary}
              </button>
              <button 
                onClick={() => setShowPaymentModal('advance')}
                className="flex-1 bg-black/10 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-black/10 flex items-center justify-center gap-2"
              >
                <Wallet size={14}/> {t.giveAdvance}
              </button>
           </div>
        </section>

        {/* --- PAYMENT HISTORY --- */}
        <section className="glass p-6 rounded-[2.5rem] space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><History size={14}/> {t.paymentHistory}</h3>
             <span className="text-[9px] font-black text-white/30 uppercase">{new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { month: 'long' })}</span>
           </div>
           <div className="space-y-3">
              {selectedPersonnel.payments.filter(pm => pm.month === currentMonth).length === 0 ? (
                <p className="text-center py-4 text-white/20 text-[10px] font-black uppercase">Henüz ödeme kaydı yok</p>
              ) : (
                selectedPersonnel.payments.filter(pm => pm.month === currentMonth).map(pm => (
                  <div key={pm.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${pm.type === 'salary' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                           {pm.type === 'salary' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
                        </div>
                        <div>
                           <p className="text-white font-bold text-xs">{t.type[pm.type]}</p>
                           <p className="text-[8px] text-white/30 font-black uppercase">{pm.date}</p>
                        </div>
                     </div>
                     <p className="text-sm font-black text-white">€{pm.amount}</p>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* --- DETAILED INFO SECTIONS (AS REQUESTED) --- */}
        <div className="space-y-4">
          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.personalInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.dob}</span><span className="text-white font-bold text-sm">{selectedPersonnel.dateOfBirth}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.pob}</span><span className="text-white font-bold text-sm">{selectedPersonnel.placeOfBirth}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.nationality}</span><span className="text-white font-bold text-sm">{selectedPersonnel.nationality}</span></div>
              <div className="pt-2 border-t border-white/5 text-white/40 text-[11px] font-medium leading-relaxed">{selectedPersonnel.address}</div>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.legalInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.healthIns}</span><span className="text-white font-bold text-sm">{selectedPersonnel.healthInsurance}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.taxId}</span><span className="text-white font-bold text-sm">{selectedPersonnel.taxId}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.ssn}</span><span className="text-white font-bold text-sm">{selectedPersonnel.socialSecurityNumber}</span></div>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.bankInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.bank}</span><span className="text-white font-bold text-sm">{selectedPersonnel.bankName}</span></div>
              <div className="text-[10px] font-mono text-white/40 bg-white/5 p-4 rounded-2xl break-all border border-white/5">{selectedPersonnel.iban}</div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.bic}</span><span className="text-white font-bold text-sm">{selectedPersonnel.bic}</span></div>
            </div>
          </section>
        </div>

        <button onClick={() => { if(window.confirm(t.deleteConfirm)) { setStaff(staff.filter(s => s.id !== selectedPersonnel.id)); setSelectedPersonnel(null); } }} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase border border-red-500/20 mt-6">SİCİL KAYDINI SİL</button>

        {/* --- PAYMENT INPUT MODAL --- */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass w-full max-w-sm p-8 rounded-[3rem] border border-white/10 space-y-6">
               <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase">{t.addPayment}</h3>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">{t.type[showPaymentModal]}</p>
               </div>
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black text-2xl">€</span>
                  <input 
                    autoFocus
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-12 pr-6 text-4xl font-black text-white focus:outline-none focus:border-primary"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                  />
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setShowPaymentModal(null)} className="flex-1 py-4 text-white/40 font-black text-xs uppercase tracking-widest">{t.cancel}</button>
                  <button onClick={handleAddPayment} className="flex-[2] bg-primary text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">{t.save}</button>
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
        <button onClick={() => setShowAddForm(true)} className="bg-primary p-3 rounded-2xl text-black shadow-lg active:scale-90 transition-all"><UserPlus size={24} /></button>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input type="text" placeholder={t.search} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className="space-y-3">
        {filteredStaff.map(person => (
          <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass p-4 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/5">
                {person.photo ? <img src={person.photo} className="w-full h-full object-cover" alt="Staff" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary font-black text-xl">{person.firstName.charAt(0)}</div>}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{person.firstName} {person.lastName}</h3>
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase border border-primary/10">{person.role}</span>
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
