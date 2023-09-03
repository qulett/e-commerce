import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';

import {
  isRedirectError,
  getURLFromRedirectError,
} from 'next/dist/client/components/redirect';

import configuration from '~/configuration';

import getSupabaseServerClient from '~/core/supabase/server-client';
import verifyRequiresMfa from '~/core/session/utils/check-requires-mfa';

/**
 * @name loadAuthPageData
 * @description This function is responsible for loading the authentication
 * layout's data.
 * If the user is logged in and does not require multi-factor
 * authentication, redirect them to the app home page. Otherwise, continue
 * to the authentication pages.
 */
const loadAuthPageData = cache(async () => {
  try {
    const client = getSupabaseServerClient();

    const {
      data: { session },
    } = await client.auth.getSession();

    const requiresMultiFactorAuthentication = await verifyRequiresMfa(client);

    // If the user is logged in and does not require multi-factor authentication,
    // redirect them to the home page.
    if (session && !requiresMultiFactorAuthentication) {
      return redirect(configuration.paths.appHome);
    }

    return {};
  } catch (e) {
    if (isRedirectError(e)) {
      return redirect(getURLFromRedirectError(e));
    }

    console.error(e);

    return {};
  }
});

export default loadAuthPageData;
