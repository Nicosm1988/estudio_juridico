"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Item = { from: "bot" | "user"; text: string };
export function ChatWidget() {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false); const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>(); const [items, setItems] = useState<Item[]>([]); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [items]);
  async function begin() {
    setOpen(true); if (conversationId || loading) return; setLoading(true);
    const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }); const data = await response.json();
    if (response.ok) { setConversationId(data.conversationId); setItems([{ from: "bot", text: data.message }]); } else setItems([{ from: "bot", text: data.error }]); setLoading(false);
  }
  async function send(event: FormEvent) {
    event.preventDefault(); const text = input.trim(); if (!text || !conversationId || loading) return; setInput(""); setItems(v => [...v, { from: "user", text }]); setLoading(true);
    const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId, message: text }) }); const data = await response.json();
    setItems(v => [...v, { from: "bot", text: response.ok ? data.message : data.error }]); setLoading(false);
  }
  return <>
    <button className="chat-launcher" onClick={begin}><MessageCircle size={20}/> Iniciar consulta guiada</button>
    {open && <section className="chat-panel" aria-label="Asistente de admisión">
      <header><div><strong>Consulta guiada</strong><small>Asistente automatizado</small></div><button aria-label="Cerrar" onClick={() => setOpen(false)}><X/></button></header>
      <div className="chat-messages" aria-live="polite">{items.map((item, i) => <p className={item.from} key={i}>{item.text}</p>)}{loading && <p className="bot muted">Escribiendo…</p>}<div ref={end}/></div>
      <form onSubmit={send}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribí tu respuesta" maxLength={2000}/><button disabled={!conversationId || loading} aria-label="Enviar"><Send size={18}/></button></form>
      <small className="chat-legal">No brinda asesoramiento jurídico. Evitá datos sensibles.</small>
    </section>}
  </>;
}
