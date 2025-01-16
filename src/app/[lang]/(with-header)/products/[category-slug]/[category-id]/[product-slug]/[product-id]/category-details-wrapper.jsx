'use client';
import bgLine from '@/asset/plates.svg';
import CategoryDetailsForm from '@/components/Forms/category-details-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {useDispatch, useSelector} from 'react-redux';
import RatingReview from '@/components/rating-review';
import ModernityBend from '@/components/ModernityBend/ModernityBend';
import {useEffect} from 'react';
import {getProductDetailsById} from '@/lib/slices/productSlice';
import _ from 'lodash';
import LogoIcon from '/public/images/logo.svg';
import Image from 'next/image';

export default function CategoryDetailsWrapper({
  params,
  lang,
  productId,
  productSlug,
}) {
  const dispatch = useDispatch();
  const {productDetails} = useSelector(state => state.productData);

  const {'category-id': categoryId, 'category-slug': categorySlug} = params;

  const {categoryList} = useSelector(state => state.categoryData);

  const categoryName =
    categoryList?.find(item => item.id === categoryId)?.alternative_name || '';

  useEffect(() => {
    if (typeof window != 'undefined' && productSlug != null) {
      dispatch(getProductDetailsById(productSlug));
    }
  }, [productSlug, dispatch]);

  if (_.isEmpty(productDetails)) {
    return (
      <div className="absolute z-50 inset-0 backdrop-blur-lg flex justify-center items-center">
        <div className="h-24 animate-bounce">
          <Image
            src={LogoIcon}
            alt="logo"
            width={500}
            height={500}
            className="h-16"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb className="text-white  bg-primary py-4">
        {categoryName && (
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang.lang}/`}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${lang.lang}/${categorySlug}/${categoryId}`}>
                {categoryName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productDetails.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        )}
      </Breadcrumb>
      <div
        className="relative w-full bg-cover bg-center"
        style={{backgroundImage: `url(${bgLine.src})`}}>
        <div className="container relative z-10">
          <h5 className="text-primary text-xl md:text-3xl lg:text-4xl py-4 md:py-8 lg:py-16 md:max-w-96">
            {productDetails.name}
          </h5>
        </div>
      </div>

      <CategoryDetailsForm lang={lang} productId={productId} />

      <RatingReview lang={lang} />

      <ModernityBend lang={lang} />
    </>
  );
}
