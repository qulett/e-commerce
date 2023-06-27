import loadDynamic from 'next/dynamic';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

import AppHeader from '~/app/(app)/components/AppHeader';
import AppContainer from '~/app/(app)/components/AppContainer';

const DashboardDemo = loadDynamic(
  () => import('~/app/(app)/components/DashboardDemo'),
  {
    ssr: false,
  }
);

export const metadata = {
  title: 'Dashboard',
};

function DashboardPage() {
  return (
    <>
      <AppHeader
        Icon={<Squares2X2Icon className={'h-6 dark:text-primary-500'} />}
      >
        Dashboard
      </AppHeader>

      <AppContainer>
        <DashboardDemo />
      </AppContainer>
    </>
  );
}

export default DashboardPage;
