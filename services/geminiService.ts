import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, Reservation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processReservationAI = async (
  reservation: Omit<Reservation, "id" | "createdAt" | "aiConfirmationMessage" | "aiChefNote">
): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Aşağıdaki restoran rezervasyon detaylarını analiz et.
      
      Müşteri: ${reservation.name}
      Kişi Sayısı: ${reservation.guests}
      Tarih: ${reservation.date}
      Saat: ${reservation.time}
      Notlar: ${reservation.notes || "Yok"}

      Görevler:
      1. Müşteri için Türkçe, çok kibar, kısa ve samimi bir onay mesajı yaz (confirmationMessage).
      2. Restoran sahibi/şef için kısa bir özet notu çıkar (chefNote). Eğer alerji veya özel istek varsa bunu vurgula. Eğer not yoksa "Standart Masa" yaz.

      Yanıtı JSON formatında ver.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
      confirmationMessage: "Rezervasyonunuz alındı. Sizi bekliyoruz!",
      chefNote: reservation.notes || "Standart Masa",
    };
  }
};
