import { pgTable, timestamp, boolean, jsonb, varchar, serial, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const embeds = pgTable("embeds", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  config: jsonb("config").notNull().$type<{
    content: {
      heading: string;
      description: string;
      items: Array<{
        id: string;
        question: string;
        answer: string;
      }>;
    };
    template: string;
    styles: any;
  }>(),
  rendered: jsonb("rendered").$type<{
    html: string;
    css: string;
    schema: any;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userUsage = pgTable("user_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  embedCopied: boolean("embed_copied").default(false).notNull(),
  embedCopyCount: integer("embed_copy_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  isPaid: boolean("is_paid").default(false).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  purchasedAt: timestamp("purchased_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
