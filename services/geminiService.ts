import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, Reservation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processReservationAI = async (
  reservation: Omit<Reservation, "id" | "createdAt" | "aiConfirmationMessage" | "aiChefNote" | "status">
): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Analysiere die folgenden Details einer Restaurantreservierung.
      
      Kunde: ${reservation.name}
      Anzahl der Personen: ${reservation.guests}
      Datum: ${reservation.date}
      Uhrzeit: ${reservation.time}
      Anmerkungen: ${reservation.notes || "Keine"}

      Aufgaben:
      1. Verfasse eine sehr höfliche, kurze und freundliche Bestätigungsnachricht für den Kunden auf Deutsch (confirmationMessage).
      2. Erstelle eine kurze Zusammenfassung für den Restaurantbesitzer/Koch (chefNote). Hebe Allergien oder Sonderwünsche hervor. Wenn keine Anmerkungen vorhanden sind, schreibe "Standardtisch".

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
    return {
      confirmationMessage: "Ihre Reservierung wurde empfangen. Wir freuen uns auf Sie!",
      chefNote: reservation.notes || "Standardtisch",
    };
  }
};
