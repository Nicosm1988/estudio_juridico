import Link from "next/link";
import { studio } from "@/lib/content";
export function Header() { return <header className="site-header"><Link className="brand" href="/"><span>EJ</span>{studio.name}</Link><nav><Link href="/#estudio">El estudio</Link><Link href="/#areas">Áreas</Link><Link href="/#proceso">Cómo trabajamos</Link><Link href="/contacto">Contacto</Link></nav></header>; }
