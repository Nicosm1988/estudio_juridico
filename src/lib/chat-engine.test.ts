import { describe, expect, it } from "vitest";
import { advance } from "./chat-engine";
describe("chat engine",()=>{it("requires consent",()=>{expect(advance("CONSENT_REQUIRED","Sí").next).toBe("ASK_FULL_NAME")});it("supports human handoff",()=>{expect(advance("ASK_SUMMARY","PERSONA").next).toBe("HUMAN_HANDOFF")});it("marks dates as urgent",()=>{expect(advance("ASK_URGENCY","Audiencia mañana").priority).toBe("HIGH")})});
