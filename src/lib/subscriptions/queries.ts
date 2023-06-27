import type { SupabaseClient } from '@supabase/supabase-js';
import { SUBSCRIPTIONS_TABLE } from '~/lib/db-tables';
import type { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

/**
 * @name getUserSubscription
 * @description Returns the user's subscription
 */
export async function getUserSubscription(client: Client, userId: string) {
  return client
    .from(SUBSCRIPTIONS_TABLE)
    .select(
      `
        id,
        status,
        currency,
        interval,
        cancelAtPeriodEnd: cancel_at_period_end,
        intervalCount: interval_count,
        priceId: price_id,
        createdAt: created_at,
        periodStartsAt: period_starts_at,
        periodEndsAt: period_ends_at,
        trialStartsAt: trial_starts_at,
        trialEndsAt: trial_ends_at,
        users_subscriptions !inner (
          customerId: customer_id,
          user_id
        )
      `
    )
    .eq('users_subscriptions.user_id', userId)
    .throwOnError()
    .maybeSingle();
}

/**
 * @name getOrganizationSubscriptionActive
 * @description Returns whether the organization is on an active
 * subscription, regardless of plan.
 */
export async function getOrganizationSubscriptionActive(
  client: Client,
  userId: string
) {
  const { data: subscription } = await getUserSubscription(client, userId);

  const status = subscription?.status;

  if (!status) {
    return false;
  }

  return status === 'active' || status === 'trialing';
}
