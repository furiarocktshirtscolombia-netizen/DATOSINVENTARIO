
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const validateFileMetadata = async (fileName: string, type: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Validar si el nombre del archivo "${fileName}" parece ser coherente con el tipo de reporte "${type}". Responde con un breve análisis en español de 15 palabras máximo.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini validation error:", error);
    return "Validación automática omitida.";
  }
};
