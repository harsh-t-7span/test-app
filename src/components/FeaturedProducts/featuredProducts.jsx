import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next-nprogress-bar';
import {ProductPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import {getFeatureProducts} from '@/lib/slices/productSlice';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {Button} from '@/components/ui/button';
import ProductCard from '../product-card';
import {createSlug} from '@/lib/utils';

const FeaturedProducts = ({lang}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {featuredProduct, isLoadingFeatureProducts} = useSelector(
    state => state.productData,
  );

  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  const handleViewDetails = item => {
    const productSlug = createSlug(item?.name);

    const categoryId = item.category[0].category_id;
    const categorySlug = item.category[0].url_key;

    router.push(
      `/${lang.lang}/${categorySlug}/${categoryId}/${productSlug}/${item.sku}`,
    );
  };

  useEffect(() => {
    dispatch(getFeatureProducts());
  }, [currentCurrency, dispatch]);

  return (
    <section className="bg-zinc-100">
      <div className="container py-20">
        <div>
          <h3 className="text-center text-4xl mb-10">
            {lang.our_featured_products}
          </h3>
          <div className="pt-5">
            {isLoadingFeatureProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({length: 4}, (_, index) => (
                  <div key={index}>
                    <ProductPlaceholder />
                  </div>
                ))}
              </div>
            ) : featuredProduct.length > 0 ? (
              <Carousel className="w-full max-w-screen-xl mx-auto">
                <CarouselContent className="-ml-1">
                  {featuredProduct.map(item => (
                    <CarouselItem
                      key={item.id}
                      className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="p-1">
                        <ProductCard
                          item={item}
                          currencyRate={currencyRate}
                          currentCurrency={currentCurrency}
                          type="FeaturedProducts"
                          lang={lang}>
                          <Button
                            onClick={() => handleViewDetails(item)}
                            variant="outline"
                            className="w-full mt-4">
                            {lang.view_details}
                          </Button>
                        </ProductCard>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <p className="text-center">No product found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
