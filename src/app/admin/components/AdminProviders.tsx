'use client';

import { useState } from 'react';
import SidebarContext from '~/lib/contexts/sidebar';
import CsrfTokenContext from '~/lib/contexts/csrf';
import Toaster from '~/components/Toaster';

function AdminProviders(
  props: React.PropsWithChildren<{
    collapsed: boolean;
    csrfToken: string | null;
  }>,
) {
  const [collapsed, setCollapsed] = useState(props.collapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <CsrfTokenContext.Provider value={props.csrfToken}>
        <Toaster />
        {props.children}
      </CsrfTokenContext.Provider>
    </SidebarContext.Provider>
  );
}

export default AdminProviders;
