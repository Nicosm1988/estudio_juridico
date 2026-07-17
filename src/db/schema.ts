import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chatState = pgEnum("chat_state", ["CONSENT_REQUIRED", "ASK_FULL_NAME", "ASK_LOCATION", "ASK_PRACTICE_AREA", "ASK_OPPOSING_PARTIES", "ASK_SUMMARY", "ASK_URGENCY", "ASK_EMAIL", "REVIEW", "COMPLETED", "HUMAN_HANDOFF", "CANCELLED"]);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(), publicCode: text("public_code").notNull().unique(),
  status: text("status").notNull().default("IN_PROGRESS"), priority: text("priority").notNull().default("NORMAL"),
  fullName: text("full_name"), email: text("email"), locality: text("locality"), practiceArea: text("practice_area"),
  opposingParties: text("opposing_parties"), summary: text("summary"), urgencyReason: text("urgency_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(), leadId: uuid("lead_id").references(() => leads.id).notNull(),
  state: chatState("state").notNull().default("CONSENT_REQUIRED"), context: jsonb("context").$type<Record<string, string>>().notNull().default({}),
  consentAccepted: boolean("consent_accepted").notNull().default(false), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(), conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  direction: text("direction").notNull(), text: text("text").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ChatState = typeof chatState.enumValues[number];
