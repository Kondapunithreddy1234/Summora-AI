
export enum SummaryLength {
  CONCISE = 'concise',
  BALANCED = 'balanced',
  DETAILED = 'detailed'
}

export enum SummaryTone {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  ACADEMIC = 'academic',
  CREATIVE = 'creative'
}

export enum SummaryFormat {
  PARAGRAPH = 'paragraph',
  BULLETS = 'bullets'
}

export interface SummaryConfig {
  length: SummaryLength;
  tone: SummaryTone;
  format: SummaryFormat;
}

export interface SummaryResult {
  content: string;
  wordCount: number;
  originalWordCount: number;
}
