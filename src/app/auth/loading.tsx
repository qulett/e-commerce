import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

function Loading() {
  return (
    <div className={'flex h-full items-center py-8'}>
      <PageLoadingIndicator fullPage={false}>
        Loading. Please wait...
      </PageLoadingIndicator>
    </div>
  );
}

export default Loading;
