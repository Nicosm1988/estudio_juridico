export const practiceAreas = [
  { slug: "civil", name: "Derecho Civil", summary: "Obligaciones, contratos y conflictos patrimoniales." },
  { slug: "familia", name: "Derecho de Familia", summary: "Acompañamiento claro en situaciones familiares sensibles." },
  { slug: "laboral", name: "Derecho Laboral", summary: "Orientación inicial para personas y organizaciones." },
  { slug: "comercial", name: "Comercial y Societario", summary: "Prevención y abordaje de conflictos empresariales." },
  { slug: "sucesiones", name: "Sucesiones", summary: "Orden y seguimiento de procesos sucesorios." },
  { slug: "consumidor", name: "Defensa del Consumidor", summary: "Revisión de relaciones y reclamos de consumo." },
  { slug: "penal", name: "Derecho Penal", summary: "Evaluación preliminar y derivación profesional." },
] as const;

export const studio = {
  name: process.env.NEXT_PUBLIC_STUDIO_NAME ?? "Estudio Jurídico X",
  email: "contacto@ejemplo.com",
  notice: "Contenido institucional y datos de contacto pendientes de validación.",
};
