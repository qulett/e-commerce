'use client';

import { useState } from 'react';
import SidebarContext from '~/lib/contexts/sidebar';
import CsrfTokenContext from '~/lib/contexts/csrf';

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
        {props.children}
      </CsrfTokenContext.Provider>
    </SidebarContext.Provider>
  );
}

export default AdminProviders;
