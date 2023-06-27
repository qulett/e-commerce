import '../app/globals.css';

import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

import configuration from '~/configuration';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import { PagesDirectoryFonts } from '~/components/Fonts';

import SiteHeader from '~/app/(site)/components/SiteHeader';

const InternalServerErrorPage: React.FC = () => {
  return (
    <>
      <Head>
        <title key="title">{`An error occurred - ${configuration.site.name}`}</title>
        <PagesDirectoryFonts />
      </Head>

      <SiteHeader />

      <div
        className={
          'm-auto flex min-h-[50vh] w-full items-center justify-center'
        }
      >
        <div className={'flex flex-col space-y-8'}>
          <div className={'flex space-x-8 divide-x divide-gray-100'}>
            <div>
              <Heading type={1}>
                <span className={'text-primary-500'}>500</span>
              </Heading>
            </div>

            <div className={'flex flex-col space-y-4 pl-8'}>
              <div className={'flex flex-col space-y-2'}>
                <div>
                  <Heading type={1}>Sorry, an unknown error occurred</Heading>
                </div>

                <p className={'text-gray-500 dark:text-gray-300'}>
                  Apologies, an error occurred while processing your request.
                  Please contact us if the issue persists.
                </p>
              </div>

              <div className={'flex space-x-4'}>
                <Button color={'secondary'} href={'/'}>
                  Contact Us
                </Button>

                <Button href={'/'}>Back to Home Page</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InternalServerErrorPage;

export function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale ?? context.defaultLocale ?? 'en';

  return {
    props: {
      locale,
    },
  };
}
