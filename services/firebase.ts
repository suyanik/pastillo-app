import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { Reservation } from "../types";

// LÜTFEN DİKKAT: Aşağıdaki alanları kendi Firebase Konsolunuzdan aldığınız bilgilerle doldurun.
// Bu bilgiler olmadan veritabanı çalışmaz.
const firebaseConfig = {
  apiKey: "BURAYA_FIREBASE_API_KEY_GELECEK",
  authDomain: "BURAYA_PROJECT_ID.firebaseapp.com",
  projectId: "BURAYA_PROJECT_ID",
  storageBucket: "BURAYA_PROJECT_ID.appspot.com",
  messagingSenderId: "BURAYA_SENDER_ID",
  appId: "BURAYA_APP_ID"
};

// Uygulamayı başlat
// Eğer config boşsa (ilk kurulumda) hata vermemesi için kontrol
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = "reservations";

// Rezervasyon Ekleme
export const addReservationToDB = async (reservation: Omit<Reservation, "id" | "createdAt">) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...reservation,
      createdAt: serverTimestamp() // Sunucu saatini kullan
    });
  } catch (error) {
    console.error("Error adding reservation: ", error);
    throw error;
  }
};

// Rezervasyon Silme
export const deleteReservationFromDB = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting reservation: ", error);
    throw error;
  }
};

// Gerçek Zamanlı Dinleme (Realtime Listener)
export const subscribeToReservations = (callback: (data: Reservation[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  
  // onSnapshot: Veritabanında bir değişiklik olduğunda otomatik tetiklenir
  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Firestore timestamp'i number'a çeviriyoruz (UI uyumluluğu için)
      createdAt: doc.data().createdAt?.toMillis() || Date.now()
    })) as Reservation[];
    
    callback(reservations);
  });
};
