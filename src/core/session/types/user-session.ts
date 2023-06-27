import type UserData from '~/core/session/types/user-data';
import type { Session } from '@supabase/gotrue-js';
import Subscription from '~/lib/subscriptions/subscription';

/**
 * This interface combines the user's metadata from
 * Supabase Auth and the user's record in Database
 */
interface UserSession {
  auth: Maybe<Session>;
  data: Maybe<UserData>;
  subscription?: Subscription | null;
  customerId?: Maybe<string>;
}

export default UserSession;
