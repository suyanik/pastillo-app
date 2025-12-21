
import React, { useState, useMemo, useRef } from 'react';
import {
  Users, UserPlus, Search, X, ChevronRight, Wallet, History,
  Camera, User, ShieldCheck, Briefcase, Image as ImageIcon,
  Landmark, Banknote, ArrowUpRight, ArrowDownRight, Trash2, Phone,
  ZoomIn, Edit3
} from 'lucide-react';
import { Personnel, Language, PersonnelPayment, AppSettings } from '../types';
import { addPersonnel, updatePersonnel, deletePersonnel, addPersonnelPayment } from '../services/firebase';

interface Props {
  lang: Language;
  staff: Personnel[];
  settings: AppSettings;
}

const PersonnelManagement: React.FC<Props> = ({ lang, staff, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<'salary' | 'advance' | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop States
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const translations: Record<Language, any> = {
    tr: {
      title: 'Personel Yönetimi', count: 'Çalışan', add: 'Yeni Kayıt', edit: 'Bilgileri Düzenle', search: 'İsim veya görev...',
      personalInfo: 'Kişisel Bilgiler', legalInfo: 'Resmi Bilgiler', bankInfo: 'Banka Bilgileri',
      employmentInfo: 'İş Bilgileri', firstName: 'Adı', lastName: 'Soyadı', dob: 'Doğum Tarihi',
      pob: 'Doğum Yeri', address: 'Adres', nationality: 'Uyruk', healthIns: 'Krankkasse (Sağlık Sig.)',
      taxId: 'Steuer ID (Vergi No)', ssn: 'SSN (Sosyal Güvenlik)', bank: 'Banka Adı', iban: 'IBAN', bic: 'BIC/SWIFT',
      startDate: 'İşe Giriş Tarihi', baseSalary: 'Net Maaş', advances: 'Ödenen', remaining: 'Kalan',
      save: 'KAYDI TAMAMLA', update: 'GÜNCELLEMELERİ KAYDET', cancel: 'İPTAL', roles: ['Şef', 'Garson', 'Mutfak', 'Komi', 'Barista', 'Temizlik'],
      deleteConfirm: 'Bu personel kaydı silinsin mi?', photo: 'Profil Fotoğrafı',
      paySalary: 'Maaş Öde', giveAdvance: 'Avans Ver', paymentHistory: 'Ödeme Geçmişi',
      type: { salary: 'Maaş', advance: 'Avans' }, paid: 'ÖDENDİ', addPayment: 'Ödeme Ekle',
      noHistory: 'Bu aya ait ödeme kaydı yok.',
      cropTitle: 'Fotoğrafı Düzenle', cropConfirm: 'KIRPMAYI ONAYLA', cropHint: 'Fotoğrafı sürükleyerek ve büyüterek hizalayın'
    },
    de: {
      title: 'Personal', count: 'Mitarbeiter', add: 'Neu anlegen', edit: 'Daten bearbeiten', search: 'Name oder Position...',
      personalInfo: 'Persönliche Daten', legalInfo: 'Gesetzliche Informationen', bankInfo: 'Bankverbindung',
      employmentInfo: 'Arbeitsverhältnis', firstName: 'Vorname', lastName: 'Nachname', dob: 'Geburtsdatum',
      pob: 'Geburtsort', address: 'Anschrift', nationality: 'Staatsangehörigkeit', healthIns: 'Krankkasse',
      taxId: 'Steuer ID', ssn: 'Sozialvers.Nr.', bank: 'Bankname', iban: 'IBAN', bic: 'BIC',
      startDate: 'Eintrittsdatum', baseSalary: 'Netto-Gehalt', advances: 'Gezahlt', remaining: 'Rest',
      save: 'REGISTRIERUNG ABSCHLIESSEN', update: 'ÄNDERUNGEN SPEICHERN', cancel: 'ABBRECHEN', roles: ['Küchenchef', 'Kellner', 'Küche', 'Hilfskraft', 'Barista', 'Reinigung'],
      deleteConfirm: 'Mitarbeiter gerçekten silinsin mi?', photo: 'Profilbild',
      paySalary: 'Gehalt zahlen', giveAdvance: 'Vorschuss geben', paymentHistory: 'Zahlungshistorie',
      type: { salary: 'Gehalt', advance: 'Vorschuss' }, paid: 'BEZAHLT', addPayment: 'Zahlung erfassen',
      noHistory: 'Keine Zahlungen in diesem Monat.',
      cropTitle: 'Foto bearbeiten', cropConfirm: 'ZUSCHNITT BESTÄTIGEN', cropHint: 'Foto ziehen und zoomen zum Ausrichten'
    },
    en: {
      title: 'Staff', count: 'Staff Count', add: 'Add Staff', edit: 'Edit Profile', search: 'Search staff...',
      personalInfo: 'Personal Info', legalInfo: 'Legal Information', bankInfo: 'Bank Details',
      employmentInfo: 'Employment Details', firstName: 'First Name', lastName: 'Last Name', dob: 'Date of Birth',
      pob: 'Place of Birth', address: 'Address', nationality: 'Nationality', healthIns: 'Health Insurance',
      taxId: 'Tax ID', ssn: 'SSN (Social Security)', bank: 'Bank Name', iban: 'IBAN', bic: 'BIC',
      startDate: 'Start Date', baseSalary: 'Net Salary', advances: 'Paid', remaining: 'Remaining',
      save: 'COMPLETE REGISTRATION', update: 'SAVE UPDATES', cancel: 'CANCEL', roles: ['Chef', 'Waiter', 'Kitchen', 'Assistant', 'Barista', 'Cleaning'],
      deleteConfirm: 'Delete this staff record?', photo: 'Profile Photo',
      paySalary: 'Pay Salary', giveAdvance: 'Give Advance', paymentHistory: 'Payment History',
      type: { salary: 'Salary', advance: 'Advance' }, paid: 'PAID', addPayment: 'Add Payment',
      noHistory: 'No payments for this month.',
      cropTitle: 'Edit Photo', cropConfirm: 'CONFIRM CROP', cropHint: 'Drag and zoom to align the photo'
    },
    es: {
      title: 'Personal', count: 'Número de empleados', add: 'Añadir personal', edit: 'Editar perfil', search: 'Buscar personal...',
      personalInfo: 'Información personal', legalInfo: 'Información legal', bankInfo: 'Información bancaria',
      employmentInfo: 'Información laboral', firstName: 'Nombre', lastName: 'Apellido', dob: 'Fecha de nacimiento',
      pob: 'Lugar de nacimiento', address: 'Dirección', nationality: 'Nacionalidad', healthIns: 'Seguro de salud',
      taxId: 'ID fiscal', ssn: 'Seguro Social', bank: 'Nombre del banco', iban: 'IBAN', bic: 'BIC',
      startDate: 'Fecha de inicio', baseSalary: 'Salario neto', advances: 'Pagado', remaining: 'Restante',
      save: 'COMPLETAR REGISTRO', update: 'GUARDAR CAMBIOS', cancel: 'CANCELAR', roles: ['Chef', 'Camarero', 'Cocina', 'Ayudante', 'Barista', 'Limpieza'],
      deleteConfirm: '¿Eliminar este registro de personal?', photo: 'Foto de perfil',
      paySalary: 'Pagar salario', giveAdvance: 'Dar adelanto', paymentHistory: 'Historial de pagos',
      type: { salary: 'Salario', advance: 'Adelanto' }, paid: 'PAGADO', addPayment: 'Añadir pago',
      noHistory: 'No hay pagos para este mes.',
      cropTitle: 'Editar foto', cropConfirm: 'CONFIRMAR CORTE', cropHint: 'Arrastra y haz zoom para alinear la foto'
    }
  };

  const t = translations[lang] || translations.de;


  const [formPerson, setFormPerson] = useState<Partial<Personnel>>({
    firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', address: '',
    nationality: '', healthInsurance: '', taxId: '', socialSecurityNumber: '',
    bankName: '', iban: '', bic: '', startDate: new Date().toISOString().split('T')[0],
    role: t.roles[0], baseSalary: 0, photo: undefined, phone: ''
  });

  const handleOpenAddForm = () => {
    setFormPerson({
      firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', address: '',
      nationality: '', healthInsurance: '', taxId: '', socialSecurityNumber: '',
      bankName: '', iban: '', bic: '', startDate: new Date().toISOString().split('T')[0],
      role: t.roles[0], baseSalary: 0, photo: undefined, phone: ''
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleOpenEditForm = () => {
    if (!selectedPersonnel) return;
    setFormPerson({ ...selectedPersonnel });
    setIsEditing(true);
    setShowForm(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result as string);
      setShowCropper(true);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    const drawWidth = img.naturalWidth * zoom;
    const drawHeight = img.naturalHeight * zoom;

    const centerX = size / 2;
    const centerY = size / 2;

    ctx.drawImage(
      img,
      centerX - (drawWidth / 2) + offset.x,
      centerY - (drawHeight / 2) + offset.y,
      drawWidth,
      drawHeight
    );

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);
    setFormPerson({ ...formPerson, photo: croppedBase64 });
    setShowCropper(false);
    setTempImage(null);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - startPos.x,
      y: clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleFormSubmit = async () => {
    if (isEditing && formPerson.id) {
      await updatePersonnel(formPerson.id, formPerson);
    } else {
      await addPersonnel(formPerson as Omit<Personnel, "id" | "payments">);
    }
    setShowForm(false);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleAddPayment = async () => {
    if (!selectedPersonnel || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const newPayment: Omit<PersonnelPayment, "id"> = {
      type: showPaymentModal as 'salary' | 'advance',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      month: new Date().toISOString().slice(0, 7)
    };

    await addPersonnelPayment(selectedPersonnel.id, newPayment);
    setShowPaymentModal(null);
    setPaymentAmount('');
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  const calculateMonthlyStats = (p: Personnel) => {
    const monthlyPayments = p.payments.filter(pm => pm.month === currentMonth);
    const totalPaid = monthlyPayments.reduce((sum, pm) => sum + pm.amount, 0);
    const remaining = Math.max(0, p.baseSalary - totalPaid);
    return { totalPaid, remaining, isFullyPaid: remaining <= 0 };
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((person: Personnel) =>
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  // FORM VIEW (Add or Edit)
  if (showForm) {
    return (
      <div className="space-y-6 pb-24 animate-in slide-in-from-bottom-4 duration-300">
        {showCropper && tempImage && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.cropTitle}</h2>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{t.cropHint}</p>
              </div>

              <div
                className="relative w-full aspect-square bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 touch-none cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={tempImage}
                  alt="Crop preview"
                  className="absolute pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    top: '50%',
                    left: '50%',
                    maxWidth: 'none'
                  }}
                />
                <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none rounded-[3rem] ring-[1000px] ring-black/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <ZoomIn className="text-white/30" size={18} />
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-primary h-1.5 bg-white/10 rounded-full appearance-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={applyCrop} className="w-full bg-primary text-black py-5 rounded-2xl font-black text-sm tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20">{t.cropConfirm}</button>
                  <button onClick={() => { setShowCropper(false); setTempImage(null); }} className="w-full py-3 text-white/30 font-black text-[10px] uppercase tracking-widest">{t.cancel}</button>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{isEditing ? t.edit : t.add}</h2>
          <button onClick={() => setShowForm(false)} className="p-3 bg-white/5 rounded-full border border-white/5"><X size={20} /></button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden relative active:scale-95 transition-all group">
            {formPerson.photo ? <img src={formPerson.photo} className="w-full h-full object-cover" alt="Staff" /> : <ImageIcon className="text-white/20" size={40} />}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={24} className="text-primary" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoSelect} />
          <p className="mt-3 text-[10px] font-black text-white/30 uppercase tracking-widest">{t.photo}</p>
        </div>

        <div className="space-y-6">
          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><User size={14} /> {t.personalInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.firstName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.firstName} onChange={e => setFormPerson({ ...formPerson, firstName: e.target.value })} />
              <input placeholder={t.lastName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.lastName} onChange={e => setFormPerson({ ...formPerson, lastName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.dob}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark] outline-none" value={formPerson.dateOfBirth} onChange={e => setFormPerson({ ...formPerson, dateOfBirth: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.nationality}</label>
                <input placeholder={t.nationality} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.nationality} onChange={e => setFormPerson({ ...formPerson, nationality: e.target.value })} />
              </div>
            </div>
            <input placeholder={t.pob} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.placeOfBirth} onChange={e => setFormPerson({ ...formPerson, placeOfBirth: e.target.value })} />
            <input placeholder={t.address} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.address} onChange={e => setFormPerson({ ...formPerson, address: e.target.value })} />
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><ShieldCheck size={14} /> {t.legalInfo}</h3>
            <input placeholder={t.healthIns} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.healthInsurance} onChange={e => setFormPerson({ ...formPerson, healthInsurance: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t.taxId} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.taxId} onChange={e => setFormPerson({ ...formPerson, taxId: e.target.value })} />
              <input placeholder={t.ssn} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.socialSecurityNumber} onChange={e => setFormPerson({ ...formPerson, socialSecurityNumber: e.target.value })} />
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Landmark size={14} /> {t.bankInfo}</h3>
            <input placeholder={t.bank} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.bankName} onChange={e => setFormPerson({ ...formPerson, bankName: e.target.value })} />
            <input placeholder={t.iban} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.iban} onChange={e => setFormPerson({ ...formPerson, iban: e.target.value })} />
            <input placeholder={t.bic} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.bic} onChange={e => setFormPerson({ ...formPerson, bic: e.target.value })} />
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Briefcase size={14} /> {t.employmentInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.startDate}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold [color-scheme:dark] outline-none" value={formPerson.startDate} onChange={e => setFormPerson({ ...formPerson, startDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase ml-2">{t.baseSalary}</label>
                <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.baseSalary || ''} onChange={e => setFormPerson({ ...formPerson, baseSalary: Number(e.target.value) })} />
              </div>
            </div>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold outline-none appearance-none" value={formPerson.role} onChange={e => setFormPerson({ ...formPerson, role: e.target.value })}>
              {t.roles.map((r: string) => <option key={r} value={r} className="bg-background-dark">{r}</option>)}
            </select>
            <input placeholder={t.phone} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold focus:border-primary transition-all outline-none" value={formPerson.phone} onChange={e => setFormPerson({ ...formPerson, phone: e.target.value })} />
          </section>

          <button
            onClick={handleFormSubmit}
            className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
          >
            {isEditing ? t.update : t.save}
          </button>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (selectedPersonnel) {
    const stats = calculateMonthlyStats(selectedPersonnel);
    return (
      <div className="space-y-6 pb-24 animate-in zoom-in duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedPersonnel(null)} className="p-3 bg-white/5 rounded-full border border-white/5"><X size={20} /></button>
            <h2 className="text-xl font-black text-white uppercase tracking-tight truncate max-w-[180px]">{selectedPersonnel.firstName} {selectedPersonnel.lastName}</h2>
          </div>
          <button onClick={handleOpenEditForm} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary active:scale-95 transition-all">
            <Edit3 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.edit.split(' ')[0]}</span>
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-[2.5rem] border-4 border-primary/20 p-1 overflow-hidden shadow-2xl">
            {selectedPersonnel.photo ? <img src={selectedPersonnel.photo} className="w-full h-full object-cover rounded-[2.2rem]" alt="Staff" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-[2.2rem] text-primary font-black text-4xl">{selectedPersonnel.firstName.charAt(0)}</div>}
          </div>
        </div>

        {/* --- SALARY & ADVANCE TRACKING PANEL --- */}
        <section className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 p-6 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">{t.baseSalary}</p>
              <h3 className="text-5xl font-black text-black tracking-tighter">€{selectedPersonnel.baseSalary.toLocaleString()}</h3>
            </div>
            <span className="bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedPersonnel.role}</span>
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
            <button onClick={() => setShowPaymentModal('salary')} className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <Banknote size={14} /> {t.paySalary}
            </button>
            <button onClick={() => setShowPaymentModal('advance')} className="flex-1 bg-black/10 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-black/10 flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Wallet size={14} /> {t.giveAdvance}
            </button>
          </div>
        </section>

        {/* --- PAYMENT HISTORY --- */}
        <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><History size={14} /> {t.paymentHistory}</h3>
            <span className="text-[9px] font-black text-white/30 uppercase">{new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { month: 'long' })}</span>
          </div>
          <div className="space-y-3">
            {selectedPersonnel.payments.filter(pm => pm.month === currentMonth).length === 0 ? (
              <p className="text-center py-6 text-white/20 text-[10px] font-black uppercase tracking-widest">{t.noHistory}</p>
            ) : (
              selectedPersonnel.payments.filter(pm => pm.month === currentMonth).map(pm => (
                <div key={pm.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${pm.type === 'salary' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {pm.type === 'salary' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    </div>
                    <div>
                      <p className="text-white font-bold text-xs uppercase">{t.type[pm.type]}</p>
                      <p className="text-[8px] text-white/30 font-black uppercase mt-0.5">{pm.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-white tracking-tight">€{pm.amount.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* --- THE 4 DETAILED INFO SECTIONS --- */}
        <div className="space-y-4">
          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><User size={12} /> {t.personalInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.dob}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.dateOfBirth}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.pob}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.placeOfBirth}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.nationality}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.nationality}</span></div>
              <div className="pt-3 mt-1 border-t border-white/5 text-white/40 text-[11px] font-medium leading-relaxed italic">{selectedPersonnel.address}</div>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><ShieldCheck size={12} /> {t.legalInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.healthIns}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.healthInsurance}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.taxId}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.taxId}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.ssn}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.socialSecurityNumber}</span></div>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Landmark size={12} /> {t.bankInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.bank}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.bankName}</span></div>
              <div className="text-[13px] font-mono font-black text-primary bg-white/5 p-4 rounded-2xl break-all border border-white/5 ring-1 ring-white/10 leading-relaxed tracking-wider">{selectedPersonnel.iban}</div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.bic}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.bic}</span></div>
            </div>
          </section>

          <section className="glass p-6 rounded-[2.5rem] space-y-4 shadow-xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Briefcase size={12} /> {t.employmentInfo}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.startDate}</span><span className="text-white font-bold text-sm tracking-tight">{selectedPersonnel.startDate}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/20 text-[10px] font-black uppercase">{t.phone}</span><a href={`tel:${selectedPersonnel.phone}`} className="text-primary font-bold text-sm flex items-center gap-1 tracking-tight"><Phone size={12} /> {selectedPersonnel.phone}</a></div>
            </div>
          </section>
        </div>

        <button onClick={async () => { if (window.confirm(t.deleteConfirm)) { await deletePersonnel(selectedPersonnel.id); setSelectedPersonnel(null); } }} className="w-full bg-red-500/10 text-red-500 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest border border-red-500/20 mt-8 flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Trash2 size={14} /> SİCİL KAYDINI KALICI OLARAK SİL
        </button>

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass w-full max-w-sm p-10 rounded-[3.5rem] border border-white/10 space-y-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.addPayment}</h3>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2 bg-primary/10 inline-block px-4 py-1 rounded-full">{t.type[showPaymentModal]}</p>
              </div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-3xl">€</span>
                <input
                  autoFocus
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-8 pl-16 pr-6 text-5xl font-black text-white focus:outline-none focus:border-primary transition-all text-center tracking-tighter"
                  placeholder="0"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={handleAddPayment} className="w-full bg-primary text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">{t.save}</button>
                <button onClick={() => setShowPaymentModal(null)} className="w-full py-4 text-white/30 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">{t.cancel}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN LIST VIEW
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">{t.title}</h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">{t.count}: {staff.length}</p>
        </div>
        <button onClick={handleOpenAddForm} className="bg-primary p-3.5 rounded-2xl text-black shadow-lg shadow-primary/10 active:scale-90 transition-all border border-primary/20"><UserPlus size={24} /></button>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
        <input type="text" placeholder={t.search} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <Users className="mx-auto text-white/10 mb-3" size={48} />
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Arama sonucu bulunamadı</p>
          </div>
        ) : (
          filteredStaff.map((person: Personnel) => (
            <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass p-5 rounded-[2.2rem] border border-white/5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.08] shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                  {person.photo ? <img src={person.photo} className="w-full h-full object-cover" alt="Staff" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary font-black text-2xl">{person.firstName.charAt(0)}</div>}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight leading-tight">{person.firstName} {person.lastName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase border border-primary/10 tracking-widest">{person.role}</span>
                    <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">€{person.baseSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-primary/20 transition-all">
                <ChevronRight className="text-white/20 group-hover:text-primary transition-colors" size={20} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonnelManagement;
