import { use } from 'react';

import Footer from '~/app/(site)/components/Footer';
import loadUserData from '~/lib/server/loaders/load-user-data';
import SiteHeaderSessionProvider from '~/app/(site)/components/SiteHeaderSessionProvider';

export const dynamic = 'force-dynamic';

function SiteLayout(props: React.PropsWithChildren) {
  const data = use(loadUserData());

  return (
    <>
      <SiteHeaderSessionProvider
        data={data.session}
        accessToken={data.accessToken}
      />

      {props.children}

      <Footer />
    </>
  );
}

export default SiteLayout;
