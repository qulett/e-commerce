import Link from 'next/link';

import configuration from '~/configuration';
import Heading from '~/core/ui/Heading';

import PasswordResetContainer from '~/app/auth/components/PasswordResetContainer';

export const metadata = {
  title: 'Password Reset',
};

function PasswordResetPage() {
  return (
    <>
      <div>
        <Heading type={6}>
          <span className={'font-medium'}>Reset your Password</span>
        </Heading>
      </div>

      <div className={'flex flex-col space-y-4'}>
        <PasswordResetContainer />

        <div className={'flex justify-center text-xs'}>
          <p className={'flex space-x-1'}>
            <span>Have you recovered your password?</span>

            <Link
              className={
                'text-primary-800 hover:underline dark:text-primary-500'
              }
              href={configuration.paths.signIn}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default PasswordResetPage;
