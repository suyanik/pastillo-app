
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, Reservation, Language } from "../types";

export const processReservationAI = async (
  reservation: Omit<Reservation, "id" | "createdAt" | "aiConfirmationMessage" | "aiChefNote" | "status">,
  lang: Language = 'de'
): Promise<GeminiResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const langMap: Record<Language, string> = {
      tr: 'Türkisch',
      de: 'Deutsch',
      en: 'Englisch',
      es: 'Spanisch'
    };
    const languageName = langMap[lang];
    
    const prompt = `
      Analysiere die folgenden Details einer Restaurantreservierung für das Restaurant "Pastillo".
      
      Kunde: ${reservation.name}
      Anzahl der Personen: ${reservation.guests}
      Datum: ${reservation.date}
      Uhrzeit: ${reservation.time}
      Anmerkungen: ${reservation.notes || "Keine"}

      Aufgaben:
      1. Verfasse eine sehr höfliche, kurze und freundliche Bestätigungsnachricht für den Kunden auf ${languageName} (confirmationMessage).
      2. Erstelle eine kurze Zusammenfassung für den Restaurantbesitzer/Koch (chefNote) auf ${languageName}. Hebe Allergien oder Sonderwünsche hervor. Wenn keine Anmerkungen vorhanden sind, schreibe "Standardtisch".

      Antworte im JSON-Format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confirmationMessage: { type: Type.STRING },
            chefNote: { type: Type.STRING },
          },
          required: ["confirmationMessage", "chefNote"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiResponse;
    }

    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini Error:", error);
    const fallbacks: Record<Language, GeminiResponse> = {
      tr: { confirmationMessage: "Rezervasyonunuz alındı. Sizi bekliyoruz!", chefNote: reservation.notes || "Standart Masa" },
      de: { confirmationMessage: "Ihre Reservierung wurde empfangen. Wir freuen uns auf Sie!", chefNote: reservation.notes || "Standardtisch" },
      en: { confirmationMessage: "Reservation received. We look forward to seeing you!", chefNote: reservation.notes || "Standard Table" },
      es: { confirmationMessage: "Reserva recibida. ¡Esperamos verte pronto!", chefNote: reservation.notes || "Mesa Estándar" }
    };
    return fallbacks[lang];
  }
};
