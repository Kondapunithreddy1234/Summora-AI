
import { GoogleGenAI } from "@google/genai";
import { SummaryConfig, SummaryLength, SummaryTone, SummaryFormat } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeText = async (text: string, config: SummaryConfig): Promise<string> => {
  const { length, tone, format } = config;

  const lengthInstruction = {
    [SummaryLength.CONCISE]: "very brief and concise, focusing only on the core message",
    [SummaryLength.BALANCED]: "informative but condensed, capturing the main points clearly",
    [SummaryLength.DETAILED]: "thorough and comprehensive, covering major supporting details"
  }[length];

  const toneInstruction = {
    [SummaryTone.PROFESSIONAL]: "formal and professional",
    [SummaryTone.CASUAL]: "casual and easy to read",
    [SummaryTone.ACADEMIC]: "scholarly and analytical",
    [SummaryTone.CREATIVE]: "engaging and creative"
  }[tone];

  const formatInstruction = {
    [SummaryFormat.PARAGRAPH]: "as a well-structured paragraph",
    [SummaryFormat.BULLETS]: "as a clear list of bullet points"
  }[format];

  const prompt = `
    Summarize the following text using intelligence.
    The summary should be ${lengthInstruction}.
    The tone should be ${toneInstruction}.
    The output format should be ${formatInstruction}.

    Input Text:
    ---
    ${text}
    ---
    
    Return only the summary text without any preamble or conversational fillers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please check your text or try again later.");
  }
};
