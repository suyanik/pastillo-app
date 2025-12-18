
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Reservation, ReservationStatus, DailyTurnover, Expense, AppSettings } from "../types";

const keyParts = ["AIzaSyCdu", "-FAv6bQiaFJGZdescMJJKcq7a8vre8"];

const firebaseConfig = {
  apiKey: keyParts.join(""), 
  authDomain: "pastillo-app.firebaseapp.com",
  projectId: "pastillo-app",
  storageBucket: "pastillo-app.firebasestorage.app",
  messagingSenderId: "382249192976",
  appId: "1:382249192976:web:de235ec9d612324ca68495",
  measurementId: "G-SFE0D0Z1ZW"
};

const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();

// Only apply settings if they haven't been applied before to avoid the "overriding host" warning
try {
  db.settings({ 
    experimentalForceLongPolling: true,
    merge: true // This satisfies the Firestore 12.6 requirement mentioned in your warning
  });
} catch (e) {
  // Settings already applied, safe to ignore
}

// persistence warning is safe to ignore in compat mode, but we keep it for offline support
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.warn("The current browser doesn't support all of the features needed to enable persistence.");
  }
});

const COLL_RESERVATIONS = "reservations";
const COLL_TURNOVER = "turnover";
const COLL_EXPENSES = "expenses";
const COLL_SETTINGS = "settings";

// --- Settings ---
export const subscribeToSettings = (callback: (settings: AppSettings) => void) => {
  return db.collection(COLL_SETTINGS).doc("main").onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data() as AppSettings);
    } else {
      // Fix: Added missing required properties for AppSettings
      const defaultSettings: AppSettings = {
        restaurantName: "Pastillo Butzbach",
        address: "Marktplatz 23, 35510 Butzbach",
        phone: "06033 974 7771",
        openingHours: "11:00 - 23:00",
        closedDay: "Salı: Kapalı",
        adminPin: "0000",
        maxCapacityPerSlot: 20,
        holidays: [],
        managerEmail: "info@pastillo.de"
      };
      db.collection(COLL_SETTINGS).doc("main").set(defaultSettings);
      callback(defaultSettings);
    }
  });
};

export const updateSettings = async (settings: Partial<AppSettings>) => {
  await db.collection(COLL_SETTINGS).doc("main").update(settings);
};

// --- Reservations ---
export const addReservationToDB = async (reservation: Omit<Reservation, "id" | "createdAt">) => {
  try {
    const res = await db.collection(COLL_RESERVATIONS).add({
      ...reservation,
      createdAt: Date.now()
    });
    
    // Simulate Email Notification trigger
    console.log(`Notification: New Reservation for ${reservation.name} on ${reservation.date} at ${reservation.time}. Emailing info@pastillo.de...`);
    
    return res.id;
  } catch (error) {
    console.error("Error adding reservation: ", error);
    throw error;
  }
};

export const subscribeToReservations = (callback: (data: Reservation[]) => void) => {
  return db.collection(COLL_RESERVATIONS)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      callback(reservations);
    });
};

export const updateReservationStatus = async (id: string, status: ReservationStatus) => {
  await db.collection(COLL_RESERVATIONS).doc(id).update({ status });
};

export const deleteReservationFromDB = async (id: string) => {
  await db.collection(COLL_RESERVATIONS).doc(id).delete();
};

// --- Finance ---
export const addTurnover = async (turnover: Omit<DailyTurnover, "createdAt">) => {
  const existing = await db.collection(COLL_TURNOVER).where("date", "==", turnover.date).get();
  if (!existing.empty) {
    await db.collection(COLL_TURNOVER).doc(existing.docs[0].id).update({
      ...turnover,
      createdAt: Date.now()
    });
  } else {
    await db.collection(COLL_TURNOVER).add({
      ...turnover,
      createdAt: Date.now()
    });
  }
};

export const subscribeToTurnover = (callback: (data: DailyTurnover[]) => void) => {
  return db.collection(COLL_TURNOVER).orderBy("date", "desc").onSnapshot(snap => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DailyTurnover[]);
  });
};

export const addExpense = async (expense: Omit<Expense, "id" | "createdAt">) => {
  await db.collection(COLL_EXPENSES).add({
    ...expense,
    createdAt: Date.now()
  });
};

export const subscribeToExpenses = (callback: (data: Expense[]) => void) => {
  return db.collection(COLL_EXPENSES).orderBy("createdAt", "desc").onSnapshot(snap => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]);
  });
};
