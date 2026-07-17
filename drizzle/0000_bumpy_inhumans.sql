CREATE TYPE "public"."chat_state" AS ENUM('CONSENT_REQUIRED', 'ASK_FULL_NAME', 'ASK_LOCATION', 'ASK_PRACTICE_AREA', 'ASK_OPPOSING_PARTIES', 'ASK_SUMMARY', 'ASK_URGENCY', 'ASK_EMAIL', 'REVIEW', 'COMPLETED', 'HUMAN_HANDOFF', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"state" "chat_state" DEFAULT 'CONSENT_REQUIRED' NOT NULL,
	"context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"consent_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_code" text NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"priority" text DEFAULT 'NORMAL' NOT NULL,
	"full_name" text,
	"email" text,
	"locality" text,
	"practice_area" text,
	"opposing_parties" text,
	"summary" text,
	"urgency_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_public_code_unique" UNIQUE("public_code")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"direction" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;