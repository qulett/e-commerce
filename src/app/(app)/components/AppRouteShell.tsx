'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import useCollapsible from '~/core/hooks/use-sidebar-state';
import AppSidebar from '~/app/(app)/components/AppSidebar';
import Toaster from '~/app/(app)/components/Toaster';
import SentryBrowserWrapper from '~/components/SentryProvider';

import UserData from '~/core/session/types/user-data';
import UserSession from '~/core/session/types/user-session';

import CsrfTokenContext from '~/lib/contexts/csrf';
import SidebarContext from '~/lib/contexts/sidebar';
import UserSessionContext from '~/core/session/contexts/user-session';
import AuthChangeListener from '~/app/(app)/components/AuthChangeListener';
import Subscription from '~/lib/subscriptions/subscription';

interface Data {
  accessToken: Maybe<string>;
  csrfToken: string | null;
  session: Session;
  user: UserData | null;
  subscription: Maybe<Subscription>;
  customerId: Maybe<string>;
  ui: {
    sidebarState?: string;
    theme?: string;
  };
}

const RouteShell: React.FCC<{
  data: Data;
}> = ({ data, children }) => {
  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: data.session,
      subscription: data.subscription,
      customerId: data.customerId,
      data: data.user ?? undefined,
    };
  }, [data]);

  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext.auth) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentUser, [updateCurrentUser]);

  return (
    <SentryBrowserWrapper>
      <UserSessionContext.Provider value={{ userSession, setUserSession }}>
        <CsrfTokenContext.Provider value={data.csrfToken}>
          <AuthChangeListener
            accessToken={data.accessToken}
            whenSignedOut={'/'}
          >
            <main>
              <Toaster />

              <RouteShellWithSidebar
                collapsed={data.ui.sidebarState === 'collapsed'}
              >
                {children}
              </RouteShellWithSidebar>
            </main>
          </AuthChangeListener>
        </CsrfTokenContext.Provider>
      </UserSessionContext.Provider>
    </SentryBrowserWrapper>
  );
};

export default RouteShell;

function RouteShellWithSidebar(
  props: React.PropsWithChildren<{
    collapsed: boolean;
  }>
) {
  const [collapsed, setCollapsed] = useCollapsible(props.collapsed);

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div className={'hidden lg:block'}>
          <AppSidebar />
        </div>

        <div className={'relative mx-auto h-screen w-full overflow-y-auto'}>
          <div>{props.children}</div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
}
