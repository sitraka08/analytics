CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"referrer_domain" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"country" text,
	"device" text,
	"browser" text,
	"os" text,
	"visitor_hash" text NOT NULL,
	"session_id" text NOT NULL,
	"duration_ms" integer
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"public_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_site_id_created_at_idx" ON "event" USING btree ("site_id","created_at");--> statement-breakpoint
CREATE INDEX "site_user_id_idx" ON "site" USING btree ("user_id");