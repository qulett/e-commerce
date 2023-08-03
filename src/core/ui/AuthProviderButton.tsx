import Button from './Button';
import AuthProviderLogo from '~/core/ui/AuthProviderLogo';

const AuthProviderButton: React.FCC<{
  providerId: string;
  onClick: () => unknown;
}> = ({ children, providerId, onClick }) => {
  return (
    <Button
      data-cy={'auth-provider-button'}
      block
      color={'custom'}
      className={`relative border border-gray-200 text-gray-600 ring-primary-200
        ring-offset-1 transition-all hover:border-gray-300 hover:bg-gray-50
        focus:ring-2 active:bg-gray-100 dark:border-dark-700
        dark:bg-dark-800 dark:text-gray-200 dark:ring-primary-500/70
        dark:hover:border-dark-600 dark:hover:bg-dark-700/50 
        dark:focus:ring-offset-dark-800 dark:active:bg-dark-700`}
      onClick={onClick}
      data-provider={providerId}
    >
      <span className={'absolute left-3 flex items-center justify-start'}>
        <AuthProviderLogo providerId={providerId} />
      </span>

      <span className={'flex w-full flex-1 items-center'}>
        <span className={'flex w-full items-center justify-center'}>
          <span className={'text-current'}>{children}</span>
        </span>
      </span>
    </Button>
  );
};

export default AuthProviderButton;
