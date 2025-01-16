'use client';

import React, {useEffect, useState} from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import Image from 'next/image';
import {useRouter} from 'next-nprogress-bar';
import {useSearchParams} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {orderDetails} from '@/lib/slices/orderSlice';
import OrderCalculation from '@/components/order-calculation';
import {OrderPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import frame from '../../../../../../../public/images/frame.png';
import _ from 'lodash';
import {Button} from '@/components';
import CancelOrderModal from '../../../../../../components/cancel-order-modal';
import {post} from '@/lib/utils';

const OrderDetailsWrapper = ({lang = {}, orderDetail}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState('');

  const orderID = orderDetail.order_id;
  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;
  const {customer, isLoggedIn} = useSelector(state => state.customerData);
  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  const {isOrderLoading, message, isError} = useSelector(
    state => state.orderData,
  );

  const orderData = orderDetail;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (typeof window != 'undefined' && orderID != null) {
      dispatch(orderDetails(orderID));
    }
  }, [orderID]);

  const [isMounted, setIsMounted] = useState(false);

  const handleTrackOrder = item => {
    const trackingNumber = item.tracking_numbers[0].tracking_number;
    const orderId = orderData.order_id;
    const itemId = item.item_id;

    localStorage.setItem('item_id', itemId);

    router.push(
      `/${lang.lang}/orders/order-details/${orderId}/track-order/${trackingNumber}`,
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container md:py-20 py-10">
          <div className="mb-8">
            <div className="mb-2">
              <h2 className="md:text-4xl text-2xl font-semibold mb-2">
                {lang.order_details}
              </h2>
              <small className="text-gray-600 md:text-xl text-base">
                {lang.order_id}:{' '}
                <span className="font-medium text-black">{orderID}</span>
              </small>
            </div>
          </div>
          <div className="mb-4 border-b-2">
            <p className="text-lg font-medium mb-1">{lang.item_orders}</p>
          </div>
          {isOrderLoading ? (
            <OrderPlaceholder />
          ) : (
            <>
              {orderData != {} && (
                <>
                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full lg:w-2/3 px-4 divide-y-2">
                      {orderData?.items?.map((item, index) => (
                        <div
                          key={item.item_id}
                          className="flex flex-col sm:flex-row items-start sm:items-center mb-6 py-6 gap-5">
                          <div className="w-full sm:w-36 sm:h-36 mb-4 sm:mb-0">
                            <Image
                              src={item.image_url}
                              width={147}
                              height={147}
                              alt="Product"
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row justify-between mb-2">
                              <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                                {lang.order_date}:{' '}
                                <span className="font-medium">
                                  {moment(
                                    orderData.created_at,
                                    'YYYY-MM-DD HH:mm:ss',
                                  ).format('DD MMM, YYYY')}
                                </span>
                              </span>
                            </div>
                            <p className="text-base sm:text-lg mb-2">
                              {item.name}
                            </p>
                            <h4 className="text-lg sm:text-xl font-bold mb-4">
                              <span>{currentCurrency}</span>{' '}
                              {_.round(item.price * currencyRate, 2).toFixed(2)}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                disabled={
                                  !item.tracking_numbers[0]?.tracking_number
                                }
                                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition duration-300 w-full sm:w-auto"
                                onClick={() => {
                                  handleTrackOrder(item);
                                }}>
                                {lang.track_order}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full lg:w-1/3 px-4 h-fit">
                      <div className="bg-white p-6  shadow mb-6">
                        <h4 className="text-2xl font-bold ">
                          {lang.order_history}{' '}
                          <small className="text-gray-600">
                            ({orderData?.items?.length}
                            {lang.items})
                          </small>
                        </h4>
                        <OrderCalculation
                          estimatePrice={orderData?.order_summary}
                          lang={lang}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 border-y-2 md:py-10 py-5">
                    <div>
                      <div className="mb-2">
                        <h3 className="font-semibold md:text-3xl text-xl">
                          {lang.delivery}
                        </h3>
                        <span className="text-zinc-600 md:text-2xl text-lg">
                          {lang.address}
                        </span>
                      </div>

                      <div className="text-lg">
                        {orderData.shipping_address ? (
                          <p className="text-sm text-muted-foreground">
                            {orderData.shipping_address?.street?.length > 0 && (
                              <>
                                {orderData.shipping_address.street.join(', ')},
                                <br />
                              </>
                            )}
                            {orderData.shipping_address?.city &&
                              orderData.shipping_address?.region &&
                              orderData.shipping_address?.postcode && (
                                <>
                                  {`${orderData.shipping_address.city}, ${orderData.shipping_address.region} - ${orderData.shipping_address.postcode}`}
                                  <br />
                                </>
                              )}
                            {orderData.shipping_address?.country_id && (
                              <>
                                {orderData.shipping_address.country_id}
                                <br />
                              </>
                            )}
                            {orderData.shipping_address?.telephone && (
                              <>
                                {`${lang.phone}: ${orderData.shipping_address.telephone}`}
                                <br />
                              </>
                            )}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {lang.address_not_available}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold md:text-3xl text-xl mb-2">
                        {lang.delivery_method}
                      </h3>
                      <p className="text-sm text-green-500">
                        {orderData.shipping_description ||
                          'Delivery method not available'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
      <PreFooter lang={lang} />
      {showModal && (
        <CancelOrderModal
          showModal={showModal}
          setShowModal={setShowModal}
          productData={productData}
        />
      )}
    </>
  );
};

export default OrderDetailsWrapper;
