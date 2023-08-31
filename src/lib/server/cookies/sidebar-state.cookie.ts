import { cookies } from 'next/headers';
import { serialize } from 'cookie';

const SIDEBAR_STATE_COOKIE_NAME = 'sidebarState';

export function parseSidebarStateCookie() {
  return cookies().get(SIDEBAR_STATE_COOKIE_NAME)?.value;
}
