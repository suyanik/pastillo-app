import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

export const analyzeReceiptAI = async (base64Image: string, lang: Language = 'tr') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompts: Record<Language, string> = {
    tr: `Bu bir restoran harcama fişi/faturasıdır. Lütfen verileri analiz et ve JSON formatında döndür. 
         Çıkarılacak Veriler: 
         - totalAmount (Sadece sayı)
         - description (Örn: Metro Market Gıda)
         - category ('Maaş/Avans', 'Tedarikçi', 'Kira/Fatura', 'Vergi', 'Diğer')
         Lütfen sadece JSON döndür.`,
    de: `Dies ist ein Kassenbeleg/Rechnung eines Restaurants. Bitte analysieren Sie die Daten und geben Sie sie im JSON-Format zurück.
         Daten:
         - totalAmount (Nur Zahl)
         - description (Z.B.: Metro Markt Einkauf)
         - category ('Gehalt/Vorschuss', 'Lieferant', 'Miete/Nebenkosten', 'Steuer', 'Sonstiges')
         Nur JSON zurückgeben.`,
    en: `This is a restaurant expense receipt/invoice. Please analyze the data and return it in JSON format.
         Data:
         - totalAmount (Number only)
         - description (E.g.: Metro Market Groceries)
         - category ('Salary/Advance', 'Supplier', 'Rent/Bills', 'Tax', 'Other')
         Return only JSON.`,
    es: `Este es un recibo/factura de gastos de un restaurante. Analice los datos y devuélvalos en formato JSON.
         Datos:
         - totalAmount (Solo número)
         - description (Ej: Compras Supermercado)
         - category ('Salario/Adelanto', 'Proveedor', 'Renta/Facturas', 'Impuestos', 'Otros')
         Devolver solo JSON.`
  };

  const prompt = prompts[lang] || prompts.tr;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
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