import './globals.css';
import {Nunito} from 'next/font/google';
import {Providers} from '@/components/providers';
import {Toaster} from '@/components/ui/toaster';
import ProgressBarProvider from '@/components/ProgressBar';
import {Poppins} from 'next/font/google';
import Head from 'next/head';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Paper Cut',
  description: 'Paper Cut',
};

export default async function RootLayout({children, params = {lang: 'en'}}) {
  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css"
          integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"></link>
      </Head>
      <body className={poppins.className}>
        <ProgressBarProvider>
          <Providers>{children}</Providers>
        </ProgressBarProvider>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
