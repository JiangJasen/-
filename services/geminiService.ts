import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyInsight = async (data: AppState): Promise<string> => {
  try {
    const summaryData = {
      totalOrders: data.orders.length,
      pendingSettlements: data.settlements.filter(s => s.status === 'Pending').length,
      avgSatisfaction: data.kpis.reduce((acc, curr) => acc + curr.satisfactionScore, 0) / (data.kpis.length || 1),
      recentPartsSales: data.parts.slice(0, 5)
    };

    const prompt = `
      As a data analyst for JD Logistics, analyze this daily snapshot:
      ${JSON.stringify(summaryData)}
      
      Provide a concise 3-bullet point summary of the operational health, highlighting any backlog in settlements or KPI trends. 
      Keep it professional and encouraging. Format as markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis temporarily unavailable.";
  }
};

export const generateReportAnalysis = async (reportType: string, data: any): Promise<string> => {
  try {
    const prompt = `
      Analyze this ${reportType} dataset for the JD Settlement System:
      ${JSON.stringify(data)}

      Identify:
      1. Top performing segment.
      2. Any concerning downward trends.
      3. One actionable recommendation for management.
      
      Keep it brief (max 150 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Unable to generate report analysis.";
  }
};