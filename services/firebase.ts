import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Reservation, ReservationStatus } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyCdu-FAv6bQiaFJGZdescMJJKcq7a8vre8",
  authDomain: "pastillo-app.firebaseapp.com",
  projectId: "pastillo-app",
  storageBucket: "pastillo-app.firebasestorage.app",
  messagingSenderId: "382249192976",
  appId: "1:382249192976:web:de235ec9d612324ca68495",
  measurementId: "G-SFE0D0Z1ZW"
};

// Initialize Firebase
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();

const COLLECTION_NAME = "reservations";

// Rezervasyon Ekleme
export const addReservationToDB = async (reservation: Omit<Reservation, "id" | "createdAt">) => {
  try {
    await db.collection(COLLECTION_NAME).add({
      ...reservation,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding reservation: ", error);
    throw error;
  }
};

// Rezervasyon Durumu Güncelleme
export const updateReservationStatus = async (id: string, status: ReservationStatus) => {
  try {
    await db.collection(COLLECTION_NAME).doc(id).update({ status });
  } catch (error) {
    console.error("Error updating reservation status: ", error);
    throw error;
  }
};

// Rezervasyon Silme
export const deleteReservationFromDB = async (id: string) => {
  try {
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    console.error("Error deleting reservation: ", error);
    throw error;
  }
};

// Gerçek Zamanlı Dinleme (Realtime Listener)
export const subscribeToReservations = (callback: (data: Reservation[]) => void) => {
  return db.collection(COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Firestore timestamp'i number'a çeviriyoruz (UI uyumluluğu için)
        createdAt: (doc.data().createdAt as any)?.toMillis() || Date.now()
      })) as Reservation[];
      
      callback(reservations);
    });
};
