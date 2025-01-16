'use client';
import React, {useEffect, useState} from 'react';
import PreFooter from '../../../../../components/PreFooter/preFooter';
import Image from 'next/image';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import {orderList} from '../../../../../lib/slices/orderSlice';
import moment from 'moment';
import {OrderPlaceholder} from '../../../../../components/SkeletonPlaceholder/skeletonPlaceholder';
import cartNotFoundImg from '../../../../../../public/images/shopping-cart.png';
import {Button} from '@/components';
import {useRouter} from 'next-nprogress-bar';

const OrderListingsWrapper = ({lang}) => {
  const {customer, isLoggedIn} = useSelector(state => state.customerData);

  const {orderDataList, isLoading, message, isError} = useSelector(
    state => state.orderData,
  );

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    orderDetails();
  }, [customer]);

  const orderDetails = () => {
    if (typeof window != 'undefined') {
      dispatch(orderList(customer?.customer_id));
    }
  };

  const imageComponent = (images, length) => {
    if (length === 1) {
      return (
        <div className="relative">
          <Image
            src={images[0]?.image_url}
            width={156}
            height={156}
            alt="Logo"
            className="rounded-sm"
          />
        </div>
      );
    } else if (length === 2) {
      return (
        <div className="relative w-[156px] h-[156px]">
          <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2">
            <Image
              src={images[1]?.image_url}
              width={156}
              height={156}
              alt="Logo"
              className="rounded-sm shadow-md"
            />
          </div>
          <div className="absolute top-0 left-0">
            <Image
              src={images[0]?.image_url}
              width={156}
              height={156}
              alt="Logo"
              className="rounded-sm shadow-md"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative w-[156px] h-[156px]">
          <div className="relative">
            <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2">
              <Image
                src={images[1]?.image_url}
                width={156}
                height={156}
                alt="Logo"
                className="rounded-sm shadow-md"
              />
            </div>
            <div className="absolute top-0 left-0 ">
              <Image
                src={images[0]?.image_url}
                width={156}
                height={156}
                alt="Logo"
                className="rounded-sm shadow-md"
              />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
            +{length - 2}
          </div>
        </div>
      );
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container md:py-20 py-10">
          <div className="row">
            <div className="col-md-12 mb-0">
              <div className="orderHdn">
                <div className="mb-2">
                  <h2 className="md:text-4xl text-2xl font-semibold mb-2">
                    {lang.order_listing}
                  </h2>
                  <small className="text-gray-600 md:text-xl text-base">
                    {lang.all_order_item_list}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {isLoading ? (
              <div className="py-10">
                <OrderPlaceholder />
              </div>
            ) : (
              <div>
                {orderDataList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <Image
                      src={cartNotFoundImg}
                      alt="Product not found"
                      width={120}
                      height={120}
                      className="mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">
                      {lang.your_order_list_is_empty}
                    </h2>
                    <p className="text-gray-600">
                      {lang.your_order_list_is_currently_empty}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 border-b-2">
                    {orderDataList.map(item => (
                      <div
                        key={item.order_id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-10 border-t-2  sm:space-y-0">
                        <div className="flex flex-col gap-5 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                          <div className="flex-shrink-0 w-full sm:w-auto">
                            {imageComponent(item?.items, item?.items.length)}
                          </div>
                          <div className="w-full sm:w-auto pb-4">
                            <h3 className="text-base md:text-lg font-semibold leading-none">
                              <span className="text-sm text-gray-600 leading-none">
                                {lang.order_id}:
                              </span>{' '}
                              {item.order_id}
                            </h3>
                            <p className="text-sm flex flex-col md:text-2xl text-gray-600 leading-0">
                              <span className="text-sm  text-gray-600 leading-0">
                                {lang.order_date}:{' '}
                              </span>
                              <strong className="md:text-xl text-lg text-black">
                                {moment(
                                  item.created_at,
                                  'YYYY-MM-DD HH:mm:ss',
                                ).format('DD MMM, YYYY')}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <Link
                            href={`/${lang.lang}/orders/order-details/${item.order_id}`}>
                            <Button
                              variant="outline"
                              className="w-full bg-transparent text-lg sm:w-auto">
                              {lang.view}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <PreFooter lang={lang} />
    </>
  );
};

export default OrderListingsWrapper;
