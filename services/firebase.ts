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
  apiKey: "AIzaSyCdu-FAv6bQiaFJGZdescMJJKcq7a8vre8",
  authDomain: "pastillo-app.firebaseapp.com",
  projectId: "pastillo-app",
  storageBucket: "pastillo-app.firebasestorage.app",
  messagingSenderId: "382249192976",
  appId: "1:382249192976:web:de235ec9d612324ca68495",
  measurementId: "G-SFE0D0Z1ZW"
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
