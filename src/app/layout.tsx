import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/header";
import { ChatWidget } from "@/components/chat-widget";
import "./globals.css";
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"] });
export const metadata: Metadata = { title: { default: "Estudio Jurídico X", template: "%s | Estudio Jurídico X" }, description: "Orientación jurídica clara, estratégica y cercana." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es-AR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=localStorage.getItem('theme')||((matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light')}catch(e){}`}}/></head><body className={`${sans.variable} ${serif.variable}`}><div className="ambient"/><Header />{children}<footer><div><strong>Estudio Jurídico X</strong><p>Contenido provisional sujeto a validación.</p></div><div><a href="/privacidad">Privacidad</a><a href="/terminos">Términos</a></div></footer><ChatWidget/><Analytics/><SpeedInsights/></body></html>; }
