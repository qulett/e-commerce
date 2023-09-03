import Footer from '~/app/(site)/components/Footer';
import loadUserData from '~/lib/server/loaders/load-user-data';
import SiteHeaderSessionProvider from '~/app/(site)/components/SiteHeaderSessionProvider';

async function SiteLayout(props: React.PropsWithChildren) {
  const data = await loadUserData();

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
