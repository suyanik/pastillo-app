
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

export const analyzeReceiptAI = async (base64Data: string, mimeType: string = "image/jpeg", lang: Language = 'de') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompts: Record<Language, string> = {
    tr: `Bu bir restoran harcama fişi/faturasıdır (Görsel veya PDF). Lütfen verileri analiz et ve JSON formatında döndür. 
         Çıkarılacak Veriler: 
         - totalAmount (Sadece sayı)
         - description (Örn: Metro Market Gıda)
         - category ('Maaş/Avans', 'Tedarikçi', 'Kira/Fatura', 'Vergi', 'Diğer')
         Lütfen sadece JSON döndür.`,
    de: `Dies ist ein Kassenbeleg/Rechnung eines Restaurants (Bild oder PDF). Bitte analysieren Sie die Daten und geben Sie sie im JSON-Format zurück.
         Daten:
         - totalAmount (Nur Zahl)
         - description (Z.B.: Metro Markt Einkauf)
         - category ('Gehalt/Vorschuss', 'Lieferant', 'Miete/Nebenkosten', 'Steuer', 'Sonstiges')
         Nur JSON zurückgeben.`,
    en: `This is a restaurant expense receipt/invoice (Image or PDF). Please analyze the data and return it in JSON format.
         Data:
         - totalAmount (Number only)
         - description (E.g.: Metro Market Groceries)
         - category ('Salary/Advance', 'Supplier', 'Rent/Bills', 'Tax', 'Other')
         Return only JSON.`,
    es: `Este es un recibo/factura de gastos de restaurante (imagen o PDF). Analice los datos y devuélvalos en formato JSON.
         Datos:
         - totalAmount (solo número)
         - description (Ej: Compras Metro Market)
         - category ('Salario/Adelanto', 'Proveedor', 'Alquiler/Facturas', 'Impuestos', 'Otros')
         Devolver solo JSON.`
  };

  const prompt = prompts[lang] || prompts.de;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalAmount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["totalAmount", "description", "category"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    return jsonStr ? JSON.parse(jsonStr) : null;
  } catch (error) {
    console.error("AI Receipt Error:", error);
    return null;
  }
};
