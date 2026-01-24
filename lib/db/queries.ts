import { eq, and, desc } from "drizzle-orm";
import { db, embeds, userUsage, userSubscriptions } from "./index";
import { FAQConfig } from "../types";

/**
 * Deep comparison of two FAQConfig objects
 */
function configMatches(config1: FAQConfig, config2: FAQConfig): boolean {
  return JSON.stringify(config1) === JSON.stringify(config2);
}

/**
 * Find an embed with matching config for a user
 */
export async function findEmbedByConfig(
  userId: string,
  config: FAQConfig
) {
  const userEmbeds = await db
    .select()
    .from(embeds)
    .where(eq(embeds.userId, userId));

  // Find embed with matching config
  for (const embed of userEmbeds) {
    if (configMatches(embed.config as FAQConfig, config)) {
      return embed;
    }
  }

  return null;
}

/**
 * Update an existing embed
 */
export async function updateEmbed(
  embedId: string,
  config: FAQConfig,
  rendered?: { html: string; css: string; schema: unknown }
) {
  const [updated] = await db
    .update(embeds)
    .set({
      config,
      ...(rendered ? { rendered } : {}),
      updatedAt: new Date(),
    })
    .where(eq(embeds.id, embedId))
    .returning();

  return updated;
}

/**
 * Create a new embed
 */
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

/**
 * Create or update an embed based on user's paid status
 * - Paid users: Reuse existing embed if config matches, otherwise create new
 * - Free users: Always create new embed
 * @returns Object with embed and reused flag
 */
export async function createOrUpdateEmbed(
  userId: string,
  config: FAQConfig,
  rendered?: { html: string; css: string; schema: unknown },
  isPaid: boolean = false
): Promise<{ embed: Awaited<ReturnType<typeof createEmbed>>; reused: boolean }> {
  // For paid users, check if there's an existing embed with matching config
  if (isPaid) {
    const existing = await findEmbedByConfig(userId, config);
    if (existing) {
      // Update existing embed with new rendered content
      const updated = await updateEmbed(existing.id, config, rendered);
      return { embed: updated, reused: true };
    }
  }

  // Create new embed (for free users or when no matching embed found for paid users)
  const newEmbed = await createEmbed(userId, config, rendered);
  return { embed: newEmbed, reused: false };
}

export async function getEmbedById(embedId: string) {
  const [embed] = await db
    .select()
    .from(embeds)
    .where(eq(embeds.id, embedId))
    .limit(1);

  return embed;
}

/**
 * Get all embeds for a user, ordered by most recently updated
 */
export async function getUserEmbeds(userId: string) {
  const userEmbeds = await db
    .select()
    .from(embeds)
    .where(eq(embeds.userId, userId))
    .orderBy(desc(embeds.updatedAt));

  return userEmbeds;
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
