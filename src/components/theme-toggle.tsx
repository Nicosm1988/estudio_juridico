"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
export function ThemeToggle(){const [dark,setDark]=useState(false);useEffect(()=>{const frame=requestAnimationFrame(()=>setDark(document.documentElement.dataset.theme==="dark"));return()=>cancelAnimationFrame(frame)},[]);function toggle(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?"dark":"light";localStorage.setItem("theme",next?"dark":"light")};return <button className="theme-toggle" onClick={toggle} aria-label={dark?"Activar modo claro":"Activar modo oscuro"}>{dark?<Sun/>:<Moon/>}<span>{dark?"Claro":"Oscuro"}</span></button>}
