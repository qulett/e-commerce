import classNames from 'classnames';

function AppContainer(
  props: React.PropsWithChildren<{
    className?: string;
  }>
) {
  return (
    <div className={classNames(`flex w-full flex-1 flex-col p-3`, props.className)}>
      {props.children}
    </div>
  );
}

export default AppContainer;
