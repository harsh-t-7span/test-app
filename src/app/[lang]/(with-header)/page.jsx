import HomePage from '@/components/home/home-component';
import {getLocales} from '../../../../get-locales';

export default async function Page({params}) {
  const lang = await getLocales(params.lang);

  return (
    <>
      <HomePage lang={lang} />
    </>
  );
}
