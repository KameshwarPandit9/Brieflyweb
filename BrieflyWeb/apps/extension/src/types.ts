export type PageData = { title: string; url: string; text: string; headings: string[] };
export type SummaryMode = 'short' | 'detailed' | 'bullets' | 'takeaways' | 'simple' | 'study';
export type LibraryEntry = { id: string; title: string; url: string; summary: string; createdAt: string; mode: SummaryMode };
