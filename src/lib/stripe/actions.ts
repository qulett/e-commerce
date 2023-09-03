'use server';

import { z } from 'zod';
import { join } from 'path';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { RedirectType } from 'next/dist/client/components/redirect';

import getLogger from '~/core/logger';
import getApiRefererPath from '~/core/generic/get-api-referer-path';

import createStripeCheckout from '~/lib/stripe/create-checkout';
import requireSession from '~/lib/user/require-session';
import getSupabaseServerClient from '~/core/supabase/server-client';

import configuration from '~/configuration';
import createBillingPortalSession from '~/lib/stripe/create-billing-portal-session';
import { withSession } from '~/core/generic/actions-utils';
import verifyCsrfToken from '~/core/verify-csrf-token';

export const createCheckoutAction = withSession(async (formData: FormData) => {
  const logger = getLogger();
  const body = Object.fromEntries(formData);
  const bodyResult = await getCheckoutBodySchema().safeParseAsync(body);

  const redirectToErrorPage = (error?: string) => {
    const referer = getApiRefererPath(headers());
    const url = join(referer, `?error=true`);

    logger.error({ error }, `Could not create Stripe Checkout session`);

    return redirect(url);
  };

  // Validate the body schema
  if (!bodyResult.success) {
    return redirectToErrorPage(`Invalid request body`);
  }

  const { priceId, customerId, returnUrl, csrfToken } = bodyResult.data;

  await verifyCsrfToken(csrfToken);

  // create the Supabase client
  const client = getSupabaseServerClient();

  // require the user to be logged in
  const sessionResult = await requireSession(client);
  const userId = sessionResult.user.id;

  const plan = getPlanByPriceId(priceId);

  // check if the plan exists in the configuration.
  if (!plan) {
    console.warn(
      `Plan not found for price ID "${priceId}". Did you forget to add it to the configuration? If the Price ID is incorrect, the checkout will be rejected. Please check the Stripe dashboard`,
    );
  }

  const trialPeriodDays =
    plan && 'trialPeriodDays' in plan
      ? (plan.trialPeriodDays as number)
      : undefined;

  // create the Stripe Checkout session
  const { url } = await createStripeCheckout({
    returnUrl,
    userId,
    priceId,
    customerId,
    trialPeriodDays,
  }).catch((e) => {
    logger.error(e, `Stripe Checkout error`);

    return redirectToErrorPage(`An unexpected error occurred`);
  });

  // retrieve the Checkout Portal URL
  const portalUrl = getCheckoutPortalUrl(url, returnUrl);

  // redirect user back based on the response
  return redirect(portalUrl, RedirectType.replace);
});

export const createBillingPortalSessionAction = withSession(
  async (formData: FormData) => {
    const body = Object.fromEntries(formData);
    const bodyResult = await getBillingPortalBodySchema().safeParseAsync(body);
    const referrerPath = getApiRefererPath(headers());

    // Validate the body schema
    if (!bodyResult.success) {
      return redirectToErrorPage(referrerPath);
    }

    const { customerId, csrfToken } = bodyResult.data;

    await verifyCsrfToken(csrfToken);

    const client = getSupabaseServerClient();
    const logger = getLogger();

    await requireSession(client);

    const referer = headers().get('referer');
    const origin = headers().get('origin');
    const returnUrl = referer || origin || configuration.paths.appHome;

    // get the Stripe Billing Portal session
    const { url } = await createBillingPortalSession({
      returnUrl,
      customerId,
    }).catch((e) => {
      logger.error(e, `Stripe Billing Portal redirect error`);

      return redirectToErrorPage(referrerPath);
    });

    // redirect to the Stripe Billing Portal
    return redirect(url, RedirectType.replace);
  },
);

function getBillingPortalBodySchema() {
  return z.object({
    customerId: z.string().min(1),
    csrfToken: z.string().min(1),
  });
}

function getCheckoutBodySchema() {
  return z.object({
    csrfToken: z.string().min(1),
    priceId: z.string().min(1),
    customerId: z.string().optional(),
    returnUrl: z.string().min(1),
  });
}

function getPlanByPriceId(priceId: string) {
  const products = configuration.stripe.products;

  type Plan = (typeof products)[0]['plans'][0];

  return products.reduce<Maybe<Plan>>((acc, product) => {
    if (acc) {
      return acc;
    }

    return product.plans.find(({ stripePriceId }) => stripePriceId === priceId);
  }, undefined);
}

/**
 *
 * @param portalUrl
 * @param returnUrl
 * @description return the URL of the Checkout Portal
 * if running in emulator mode and the portal URL is undefined (as
 * stripe-mock does) then return the returnUrl (i.e. it redirects back to
 * the subscriptions page)
 */
function getCheckoutPortalUrl(portalUrl: string | null, returnUrl: string) {
  if (isTestingMode() && !portalUrl) {
    return [returnUrl, 'success=true'].join('?');
  }

  return portalUrl as string;
}

/**
 * @description detect if Stripe is running in emulator mode
 */
function isTestingMode() {
  const enableStripeTesting = process.env.ENABLE_STRIPE_TESTING;

  return enableStripeTesting === 'true';
}

function redirectToErrorPage(referrerPath: string) {
  const url = join(referrerPath, `?error=true`);

  return redirect(url);
}
