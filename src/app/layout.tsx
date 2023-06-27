import './globals.css';

import { cookies } from 'next/headers';
import classNames from 'classnames';

import ThemeSetter from '~/components/ThemeSetter';
import Fonts from '~/components/Fonts';

import configuration from '~/configuration';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={configuration.site.locale} className={getClassName()}>
      <Fonts />
      <ThemeSetter />

      <body>{children}</body>
    </html>
  );
}

function getClassName() {
  const theme = cookies().get('theme')?.value;
  const dark = theme === 'dark';

  return classNames({
    dark,
  });
}

export const metadata = {
  title: configuration.site.name,
  description: configuration.site.description,
  openGraph: {
    url: configuration.site.siteUrl,
    siteName: configuration.site.siteName,
    description: configuration.site.description,
  },
  themeColor: configuration.site.themeColor,
  twitter: {
    card: 'summary_large_image',
    title: configuration.site.name,
    description: configuration.site.description,
    creator: configuration.site.twitterHandle,
  },
  icons: {
    icon: '/assets/images/favicon/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/assets/images/favicon/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
};
