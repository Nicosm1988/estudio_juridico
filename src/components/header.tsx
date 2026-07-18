import Link from "next/link";
import { studio } from "@/lib/content";
import { ThemeToggle } from "./theme-toggle";
export function Header(){return <header className="site-header"><Link className="brand" href="/"><span>EJ</span>{studio.name}</Link><nav><Link href="/el-estudio">El estudio</Link><Link href="/areas-de-practica">Áreas</Link><Link href="/como-trabajamos">Cómo trabajamos</Link><Link href="/preguntas-frecuentes">Preguntas</Link><Link href="/contacto">Contacto</Link></nav><ThemeToggle/></header>}
