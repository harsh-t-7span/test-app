'use client';

import {use, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCartList,
  getProductsById,
  setProductList,
  resetProductList,
} from '@/lib/slices/productSlice';
import ProductCard from '@/components/product-card';
import ShortByComponent from '@/components/short-by';
import {Button} from '@/components';
import {useRouter} from 'next/navigation';
import {ProductPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import Image from 'next/image';
import notFoundImg from '../../../../../../public/images/notfound.png';
// import notFoundImg from '../../../../../public/images/notfound.png';
import noBnrImg from '../../../../../asset/nobanner.jpg';
// import noBnrImg from '../../../../asset/nobanner.jpg';
import {createSlug, get} from '../../../../../lib/utils';
import {Waypoint} from 'react-waypoint';

export default function CategoryListWrapper({
  params,
  lan,
  categoryDetails,
  list,
}) {
  const {'category-id': categoryId} = params;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const pageSize = 4;
  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  const {productList, isLoadingProductsById} = useSelector(
    state => state.productData,
  );

  const {customer} = useSelector(state => state.customerData);
  const {categoryList} = useSelector(state => state.categoryData);

  const categoryName =
    categoryList?.find(item => item.id === categoryId)?.alternative_name || '';

  useEffect(() => {
    if (customer?.customer_id) {
      dispatch(getCartList(customer.customer_id));
    }
  }, [customer, dispatch]);

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const newProducts = await get(
        `${BASE_URL}category/products/${categoryId}?page=${nextPage}&pageSize=${pageSize}`,
      );

      if (newProducts.products.length > 0) {
        dispatch(setProductList(newProducts.products));

        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleViewDetails = item => {
    const productSlug = createSlug(item.name);
    router.push(`${categoryId}/${productSlug}/${item.sku}`);
  };

  useEffect(() => {
    dispatch(setProductList(list.products || []));
  }, []);

  useEffect(() => {
    dispatch(resetProductList());
    setPage(1);

    dispatch(setProductList(list.products || []));
  }, [categoryId, list, dispatch]);

  return (
    <>
      <section className="mainBnr innerpage  hidden sm:block">
        <div className="bnrTxt">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 py-16">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold mb-4">
                  {categoryDetails?.name ? categoryDetails?.name : ''}
                </h2>
                {/* <Button
                  variant="secondary"
                  className=" mt-6 px-6 py-3 rounded-lg text-base md:text-lg"
                  onClick={() => router.push(`${lan.lang}/`)}>
                  {lan.shop_now || 'Shop Now'}
                </Button> */}{' '}
              </div>
            </div>
          </div>
        </div>
        <Image
          src={
            categoryDetails?.image_url ? categoryDetails?.image_url : noBnrImg
          }
          width={1920}
          height={539}
          alt={categoryDetails?.name ? categoryDetails?.name : ''}
          className="w-full object-cover mt-6 min-h-[500px] h-auto"
        />{' '}
      </section>

      <div className="container flex flex-wrap gap-5 justify-between items-center py-7 sm:py-14">
        <span className="md:text-4xl text-2xl ">{categoryName}</span>

        <ShortByComponent lang={lan} />
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
        {isLoadingProductsById && productList.length >= 4 ? (
          Array.from({length: 4}, (_, index) => (
            <div
              className="item col-md-3 my-3"
              key={`loading-placeholder-${index}`}>
              <ProductPlaceholder />
            </div>
          ))
        ) : productList?.length > 0 ? (
          <>
            {productList.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                currencyRate={currencyRate}
                currentCurrency={currentCurrency}
                lang={lan}
                type="CategoryProducts">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(item)}>
                  {lan.view_details}
                </Button>
              </ProductCard>
            ))}
            {hasMore && !isLoadingMore && (
              <Waypoint onEnter={loadMoreProducts} bottomOffset={50} />
            )}
            {isLoadingMore &&
              productList.length >= 4 &&
              Array.from({length: 4}, (_, index) => (
                <div
                  className="item col-md-3 my-3"
                  key={`loading-more-${index}`}>
                  <ProductPlaceholder />
                </div>
              ))}
          </>
        ) : (
          <div className="col-span-4 space-y-4 text-center p-4 w-full">
            <Image
              src={notFoundImg}
              alt="Wishlist is empty"
              width={120}
              height={120}
              className="mx-auto"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {lan.product_not_found}
            </h2>
            <p className="text-sm text-gray-600">{lan.no_product}</p>
          </div>
        )}
      </div>
    </>
  );
}
