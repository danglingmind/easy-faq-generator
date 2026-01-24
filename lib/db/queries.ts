import { eq, and } from "drizzle-orm";
import { db, embeds, userUsage, userSubscriptions } from "./index";
import { FAQConfig } from "../types";

export async function createEmbed(
  userId: string,
  config: FAQConfig,
  rendered?: { html: string; css: string; schema: unknown }
) {
  const [embed] = await db
    .insert(embeds)
    .values({
      userId,
      config,
      ...(rendered ? { rendered } : {}),
    })
    .returning();

  return embed;
}

export async function getEmbedById(embedId: string) {
  const [embed] = await db
    .select()
    .from(embeds)
    .where(eq(embeds.id, embedId))
    .limit(1);

  return embed;
}

export async function getUserUsage(userId: string) {
  const [usage] = await db
    .select()
    .from(userUsage)
    .where(eq(userUsage.userId, userId))
    .limit(1);

  return usage;
}

export async function createOrUpdateUserUsage(
  userId: string,
  updates: { embedCopied?: boolean; embedCopyCount?: number }
) {
  const existing = await getUserUsage(userId);

  if (existing) {
    const [updated] = await db
      .update(userUsage)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userUsage.userId, userId))
      .returning();

    return updated;
  } else {
    const [created] = await db
      .insert(userUsage)
      .values({
        userId,
        embedCopied: updates.embedCopied || false,
        embedCopyCount: updates.embedCopyCount || 0,
      })
      .returning();

    return created;
  }
}

export async function getUserSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);

  return subscription;
}

export async function createOrUpdateUserSubscription(
  userId: string,
  updates: {
    isPaid?: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    purchasedAt?: Date;
  }
) {
  const existing = await getUserSubscription(userId);

  if (existing) {
    const [updated] = await db
      .update(userSubscriptions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId))
      .returning();

    return updated;
  } else {
    const [created] = await db
      .insert(userSubscriptions)
      .values({
        userId,
        isPaid: updates.isPaid || false,
        stripeCustomerId: updates.stripeCustomerId,
        stripeSubscriptionId: updates.stripeSubscriptionId,
        purchasedAt: updates.purchasedAt,
      })
      .returning();

    return created;
  }
}
