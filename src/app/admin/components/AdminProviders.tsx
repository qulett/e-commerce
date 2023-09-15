'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
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
        <Toaster />
        {props.children}
      </CsrfTokenContext.Provider>
    </SidebarContext.Provider>
  );
}

export default AdminProviders;
