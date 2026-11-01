import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'BrieflyWeb', description: 'An AI web assistant for careful reading and knowledge capture.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
