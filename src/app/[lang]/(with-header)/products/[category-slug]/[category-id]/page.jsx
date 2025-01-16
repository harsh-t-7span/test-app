import ModernityBend from '@/components/ModernityBend/ModernityBend';
import PreFooter from '@/components/PreFooter/preFooter';
import {cookies} from 'next/headers';
import {getLocales} from '../../../../../../get-locales';
import {TOKEN} from '../../../../../lib/apis/keywords';
import CategoryListWrapper from './category-list-wrapper';

const page = async ({params}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value;
  const {lang, 'category-id': categoryId} = params;

  const page = 1;
  const pageSize = 4;

  const lan = await getLocales(lang);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const list = await fetch(
    `${BASE_URL}category/products/${categoryId}?page=${page}&pageSize=${pageSize}`,
    {next: {revalidate: 0}, headers: {Authorization: `Bearer ${token}`}},
  ).then(res => res.json());

  const categoryDetails = list.category;

  return (
    <>
      <CategoryListWrapper
        params={params}
        lan={lan}
        list={list}
        categoryDetails={categoryDetails}
      />
      <ModernityBend lang={lan} />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
