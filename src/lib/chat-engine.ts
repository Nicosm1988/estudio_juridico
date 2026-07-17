import type { ChatState } from "@/db/schema";

export type ChatReply = { next: ChatState; message: string; field?: string; value?: string; priority?: string; completed?: boolean };

const prompts: Record<ChatState, string> = {
  CONSENT_REQUIRED: "Para continuar necesitamos registrar tus respuestas para analizar la consulta y comunicarnos con vos. ¿Aceptás?",
  ASK_FULL_NAME: "Gracias. ¿Cuál es tu nombre y apellido?",
  ASK_LOCATION: "¿En qué localidad y provincia te encontrás?",
  ASK_PRACTICE_AREA: "¿Con qué área se relaciona tu consulta? Podés elegir Civil, Familia, Laboral, Comercial, Sucesiones, Consumidor, Penal u Otra.",
  ASK_OPPOSING_PARTIES: "Indicá los nombres de las otras personas o empresas involucradas. Esto permite un control preliminar de conflictos.",
  ASK_SUMMARY: "Contanos brevemente qué ocurrió. No envíes documentación ni datos sensibles.",
  ASK_URGENCY: "¿Hay una audiencia, vencimiento, intimación o fecha cercana? Indicá cuál o respondé ‘No’.",
  ASK_EMAIL: "Si querés, dejá un correo electrónico de contacto. También podés responder ‘Omitir’.",
  REVIEW: "Revisá la información. Escribí CONFIRMAR para enviarla o REINICIAR para comenzar de nuevo.",
  COMPLETED: "Tu consulta quedó registrada.", HUMAN_HANDOFF: "Marcamos tu consulta para revisión humana.", CANCELLED: "La admisión fue cancelada.",
};

export function initialMessage() { return `Hola. Soy el asistente automatizado de admisión. Este canal recopila información preliminar: no brinda asesoramiento jurídico ni implica aceptación del asunto. Evitá enviar documentación o datos sensibles.\n\n${prompts.CONSENT_REQUIRED}`; }

export function advance(state: ChatState, input: string): ChatReply {
  const value = input.trim(); const command = value.toLocaleUpperCase("es-AR");
  if (["PERSONA", "RECEPCIÓN", "HABLAR CON ALGUIEN"].includes(command)) return { next: "HUMAN_HANDOFF", message: prompts.HUMAN_HANDOFF };
  if (command === "CANCELAR") return { next: "CANCELLED", message: prompts.CANCELLED };
  if (command === "PRIVACIDAD") return { next: state, message: "Podés consultar nuestra política en /privacidad. " + prompts[state] };
  if (command === "ELIMINAR MIS DATOS") return { next: "HUMAN_HANDOFF", message: "Registramos tu solicitud para revisión humana. No eliminaremos información automáticamente." };
  if (command === "REINICIAR") return { next: "CONSENT_REQUIRED", message: initialMessage() };
  if (value.length < 2) return { next: state, message: "Necesito un poco más de información. " + prompts[state] };
  const flow: Partial<Record<ChatState, { next: ChatState; field?: string }>> = {
    ASK_FULL_NAME: { next: "ASK_LOCATION", field: "fullName" }, ASK_LOCATION: { next: "ASK_PRACTICE_AREA", field: "locality" },
    ASK_PRACTICE_AREA: { next: "ASK_OPPOSING_PARTIES", field: "practiceArea" }, ASK_OPPOSING_PARTIES: { next: "ASK_SUMMARY", field: "opposingParties" },
    ASK_SUMMARY: { next: "ASK_URGENCY", field: "summary" }, ASK_URGENCY: { next: "ASK_EMAIL", field: "urgencyReason" }, ASK_EMAIL: { next: "REVIEW", field: "email" },
  };
  if (state === "CONSENT_REQUIRED") {
    if (/^(s[ií]|acepto|continuar)$/i.test(value)) return { next: "ASK_FULL_NAME", message: prompts.ASK_FULL_NAME };
    return { next: "CANCELLED", message: "Entendido. No continuaremos recopilando información. Podés usar los datos institucionales de contacto." };
  }
  if (state === "REVIEW") return command === "CONFIRMAR" ? { next: "COMPLETED", message: prompts.COMPLETED, completed: true } : { next: state, message: prompts.REVIEW };
  const step = flow[state]; if (!step) return { next: state, message: prompts[state] };
  const urgent = state === "ASK_URGENCY" && !/^(no|ninguna|no hay)$/i.test(value);
  return { next: step.next, message: prompts[step.next], field: step.field, value, priority: urgent ? "HIGH" : undefined };
}
