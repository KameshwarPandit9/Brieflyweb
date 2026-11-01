import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Search, Trash2 } from 'lucide-react';
import type { LibraryEntry } from '../types';
import './style.css';

function App() {
  const [items, setItems] = useState<LibraryEntry[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { chrome.storage.local.get(['library'], v => setItems((v.library || []) as LibraryEntry[])); }, []);
  async function remove(id: string) { const next = items.filter(x => x.id !== id); setItems(next); await chrome.storage.local.set({library: next}); }
  const filtered = items.filter(x => `${x.title} ${x.url} ${x.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <main><header><div className="badge"><BookOpen size={17}/></div><div><h1>Knowledge library</h1><p>Your summaries are stored on this device.</p></div></header><label className="search"><Search size={15}/><input placeholder="Search saved pages" value={query} onChange={e=>setQuery(e.target.value)}/></label>{!filtered.length ? <section className="empty"><BookOpen size={23}/><b>{items.length ? 'No matching pages' : 'Your library is empty'}</b><p>Summaries you save from the popup will appear here.</p></section> : <div className="list">{filtered.map(item=><article key={item.id}><div className="top"><span>{new Date(item.createdAt).toLocaleDateString()}</span><button aria-label="Delete saved summary" onClick={()=>remove(item.id)}><Trash2 size={15}/></button></div><h2>{item.title}</h2><a href={item.url} target="_blank" rel="noreferrer">{item.url}</a><p>{item.summary}</p></article>)}</div>}</main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
