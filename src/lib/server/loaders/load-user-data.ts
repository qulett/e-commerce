import 'server-only';

import { getUserDataById } from '~/lib/server/queries';
import getSupabaseServerClient from '~/core/supabase/server-client';

/**
 * @name loadUserData
 * @description Loads the user's data from Supabase Auth and Database.
 * This is used in the (site) layout to display the user's name and avatar.
 */
async function loadUserData() {
  const client = getSupabaseServerClient();

  try {
    const { data, error } = await client.auth.getSession();

    if (!data.session || error) {
      return emptyUserData();
    }

    const session = data.session;
    const userId = session.user.id;
    const userData = await getUserDataById(client, userId);
    const accessToken = session.access_token;

    return {
      accessToken,
      session: {
        auth: {
          accessToken: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
          },
        },
        data: userData || undefined,
      },
    };
  } catch (e) {
    return emptyUserData();
  }
}

async function emptyUserData() {
  return {
    accessToken: undefined,
    session: undefined,
  };
}

export default loadUserData;
