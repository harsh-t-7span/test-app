'use client';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useRouter, useSearchParams} from 'next/navigation';
import _ from 'lodash';
import Image from 'next/image';
import PreFooter from '@/components/PreFooter/preFooter';
import ModernityBend from '@/components/ModernityBend/ModernityBend';
import {getProductsBySeach} from '@/lib/slices/searchProductSlice';
import {ProductPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import ProductCard from '@/components/product-card';
import {Button} from '@/components/ui/button';

import noImg from '../../../../asset/no-image.jpg';
import notFoundImg from '../../../../asset/notfound.png';
import productBnrImg from '../../../../asset/productbnr.jpg';
import {createSlug} from '../../../../lib/utils';

const SearchWrapper = ({lang}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );
  const {searchProductList, pageSize, totalCount, isLoadingProductsBySearch} =
    useSelector(state => state.searchProductData);

  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const categoryId = searchParams.get('categoryId');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getProductsBySeach({
        search: search ? search : '',
        categoryId: categoryId ? categoryId : '',
        currentPage: currentPage,
        perPages: pageSize,
      }),
    );
  }, [searchParams]);

  const handleViewDetails = item => {
    const productSlug = createSlug(item?.name);

    const categoryId = item.category[0].category_id;
    const categorySlug = item.category[0].url_key;

    router.push(
      `/${lang.lang}/${categorySlug}/${categoryId}/${productSlug}/${item.sku}`,
    );
  };

  useEffect(() => {}, [currentCurrency]);

  const updatePagePagination = number => {
    setCurrentPage(number);
    dispatch(
      getProductsBySeach({
        search: search ? search : '',
        categoryId: categoryId ? categoryId : '',
        currentPage: number,
        perPages: pageSize,
      }),
    );
  };

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-4">
                {lang.t_100_recycled}
                <br />
                {lang.content}
              </h2>
              <Button variant="secondary">{lang.shop_now}</Button>
            </div>
          </div>
        </div>
        <Image
          src={productBnrImg}
          width={1920}
          height={539}
          alt="banner"
          className="w-full"
        />
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoadingProductsBySearch ? (
              Array.from({length: 12}, (_, index) => (
                <div key={index}>
                  <ProductPlaceholder />
                </div>
              ))
            ) : searchProductList?.length > 0 ? (
              searchProductList.map(item => (
                <div key={item.id}>
                  <ProductCard
                    item={item}
                    currencyRate={currencyRate}
                    currentCurrency={currentCurrency}
                    type="SearchedProducts"
                    lang={lang}>
                    <Button
                      onClick={() => handleViewDetails(item)}
                      variant="outline"
                      className="w-full mt-4">
                      {lang.view_details}
                    </Button>
                  </ProductCard>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center">
                <Image
                  src={notFoundImg}
                  alt="Product not found"
                  width={100}
                  height={100}
                  className="mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">
                  {lang.products_not_found}
                </h2>
                <p className="text-gray-600">
                  {
                    lang.We_sorry_but_the_product_you_looking_for_is_not_available
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <ModernityBend lang={lang} />
      <PreFooter lang={lang} />
    </>
  );
};

export default SearchWrapper;
