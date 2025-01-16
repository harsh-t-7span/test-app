'use client';
import React, {useEffect, useState} from 'react';
import ShippingModal from '@/components/shipping-modal';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {
  completeShippingCost,
  estimationCost,
  removeCoupon,
} from '@/lib/slices/productSlice';
import {
  CartlistPlaceholder,
  EstimationCostPlaceHolder,
  PaymentBtnPlaceholder,
  TotalAmountPlaceholder,
} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import Image from 'next/image';
import Link from 'next/link';
import Calculation from '@/components/calculation';
import CartItems from '@/components/cart-items';
import {removeAddress} from '@/lib/slices/customerAuthSlice';
import fiSrCheckboxImg from '../../../../../public/images/fi-sr-checkbox.png';
import {SHIPMETHOD} from '@/lib/apis/keywords';
import {Button} from '@/components';
import Cookies from 'js-cookie';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {useRouter} from 'next-nprogress-bar';
import {Check} from '../../../../../public/icons';

const ShippingAddressWrapper = ({lang}) => {
  const [show, setShow] = useState(false);
  const {
    cartId,
    cartList,
    estimatePrice,
    isLoadingEstimationCost,
    extraCostList,
    isLoadingCompleteShippingCost,
    paymentMethods,
    shippingAddress,
  } = useSelector(state => state.productData);

  const {currentCurrency, currencyRate, countryList} = useSelector(
    state => state.currencyData,
  );
  const {customer, isLoggedIn, shippingAddressList, addressLoading} =
    useSelector(state => state.customerData);

  // const defaultAddressId = Cookies.get('addressId');

  const [addressData, setAddressData] = useState('');
  const [editAddressData, setEditAddressData] = useState('');
  const [editableData, setEditableData] = useState(false);
  const [addressId, setAddressId] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [shippingMethodSelected, setShippingMethodSelected] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();

  const handleShow = () => {
    setShow(true);
    setEditableData(false);
  };

  useEffect(() => {
    estimationCostFunc();
  }, [shippingAddressList]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  const estimationCostFunc = () => {
    let shippingData = shippingAddressList.filter(
      item => item.is_default_shipping == true,
    );
    if (shippingData.length > 0) {
      setAddressId(shippingData.id);
      if (extraCostList?.length == 0) {
        const estimationData = {
          address: {
            city: shippingData[0].city,
            country_id: shippingData[0].country_id,
            postcode: shippingData[0].postcode,
          },
        };
        dispatch(estimationCost(estimationData));
      }
    }
  };

  const completeCostFunc = item => {
    let shipping_address_data = '';
    if (!addressData) {
      setAddressId(customer?.addresses?.default_shipping?.id);
      shipping_address_data = {
        region: customer?.addresses?.default_shipping?.region?.region,
        region_id: customer?.addresses?.default_shipping?.region?.region_id,
        region_code: customer?.addresses?.default_shipping?.region?.region_code,
        country_id: customer?.addresses?.default_shipping?.country_id,
        street: customer?.addresses?.default_shipping?.street,
        postcode: customer?.addresses?.default_shipping?.postcode,
        city: customer?.addresses?.default_shipping?.city,
        firstname: customer?.firstname,
        lastname: customer?.lastname,
        customer_id: customer?.customer_id,
        email: customer?.email,
        telephone: customer?.addresses?.default_shipping?.telephone,
        same_as_billing:
          customer?.addresses?.default_shipping?.id ==
          customer?.addresses?.default_billing?.id
            ? 1
            : 0,
      };
    } else {
      shipping_address_data = {
        region: addressData?.region,
        region_id: addressData?.region?.region_id,
        region_code: addressData?.region?.region_code,
        country_id: addressData?.country_id,
        street: addressData?.street,
        postcode: addressData?.postcode,
        city: addressData?.city,
        firstname: addressData?.firstname,
        lastname: addressData?.lastname,
        customer_id: customer?.customer_id,
        email: customer?.email,
        telephone: addressData?.telephone,
        same_as_billing:
          addressData.id == customer?.addresses?.default_billing?.id ? 1 : 0,
      };
    }
    let data = {
      addressInformation: {
        shipping_address: shipping_address_data,
        billing_address: {
          region: customer?.addresses?.default_billing?.region?.region,
          region_id: customer?.addresses?.default_billing?.region?.region_id,
          region_code:
            customer?.addresses?.default_billing?.region?.region_code,
          country_id: customer?.addresses?.default_billing?.country_id,
          street: customer?.addresses?.default_billing?.street,
          postcode: customer?.addresses?.default_billing?.postcode,
          city: customer?.addresses?.default_billing?.city,
          firstname: customer?.firstname,
          lastname: customer?.lastname,
          customer_id: customer?.customer_id,
          email: customer?.email,
          telephone: customer?.addresses?.default_billing?.telephone,
          same_as_billing:
            customer?.addresses?.default_shipping?.id ==
            customer?.addresses?.default_billing?.id
              ? 1
              : 0,
        },
        shipping_carrier_code: item.carrier_code,
        shipping_method_code: item.method_code,
      },
    };

    localStorage.setItem(SHIPMETHOD, JSON.stringify(data));
    Cookies.set(SHIPMETHOD, JSON.stringify(data));

    dispatch(completeShippingCost(data));
  };

  const addressFunc = item => {
    const estimationData = {
      address: {
        city: item.city,
        country_id: item.country_id,
        postcode: item.postcode,
      },
    };
    setAddressId(item.id);
    setAddressData(item);
    dispatch(estimationCost(estimationData));
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (cartList) return;
    else router.replace(`/${lang.lang}/`);
  }, [cartList]);

  if (!isMounted) return null;

  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container py-10">
          <div className="flex justify-between">
            <div className="mb-2 space-y-2">
              <h2 className="text-2xl md:text-4xl font-bold">
                {lang.checkout || 'Checkout'}
              </h2>
              <p className="text-lg md:text-xl font-semibold">
                {lang.shipping_address || 'Shipping Address'}
              </p>
            </div>
            {!isLoggedIn && (
              <Link
                href={'/sign-in'}
                className="text-lg md:text-xl font-bold text-primary">
                Sign In
              </Link>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full justify-between">
            <div className="flex-grow lg:w-2/3 w-full">
              <div className="flex flex-wrap gap-2 lg:gap-6">
                {shippingAddressList?.length > 0 &&
                  shippingAddressList?.map((item, index) => {
                    return (
                      <div key={item.id} className="my-2 w-72">
                        <div className="h-full w-full relative">
                          <input
                            onChange={() => {}}
                            type="radio"
                            id={`address1${item.id}`}
                            name="address-group"
                            className="hidden peer"
                            // checked={item?.is_default_shipping == true}
                          />
                          <Image
                            src={fiSrCheckboxImg}
                            className="absolute top-0 right-0 opacity-0 peer-checked:opacity-100"
                            alt=""
                            height={20}
                            width={20}
                          />
                          <div className="w-full h-full p-5 border-2 border-zinc-200 flex flex-col justify-between rounded-xl peer-checked:border-primary">
                            <p className="mb-2">{item.street[0]}</p>
                            <h3 className="text-primary font-semibold mb-4 text-xl">
                              {item.telephone}
                            </h3>
                            <div>
                              <label
                                onClick={() => {
                                  setSelectedId(item.id);
                                  addressFunc(item);
                                  setShippingMethodSelected(
                                    estimatePrice?.shipping_carrier
                                      ?.shipping_price != null,
                                  );
                                }}
                                htmlFor={`address1${item.id}`}
                                className={`me-2 border border-black text-xs px-3 py-1.5 rounded-sm cursor-pointer transition-all 
                                  ${
                                    selectedId === item.id
                                      ? 'bg-primary text-white border-primary'
                                      : 'hover:bg-primary hover:text-white hover:border-primary'
                                  }`}>
                                {lang.ship || 'Ship'}
                              </label>
                              <label
                                onClick={() => {
                                  setEditAddressData(item);
                                  setEditableData(true);
                                  setShow(true);
                                }}
                                className="me-2 border border-black text-xs px-3 py-1.5 rounded-sm cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all">
                                {lang.edit || 'Edit'}
                              </label>
                              {item.is_default_shipping != true &&
                                item.is_default_billing != true && (
                                  <label
                                    variant="outline"
                                    onClick={() => {
                                      dispatch(removeAddress(item.id));
                                    }}
                                    className="me-2 border border-black text-xs px-3 py-1.5 rounded-sm cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    {lang.delete || 'Delete'}
                                  </label>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <Button
                className="hover:bg-black mt-3 lg:mt-6"
                onClick={handleShow}>
                {lang.new_address || 'New Address'}
              </Button>

              {selectedId && (
                <div className="mt-7 lg:mt-14">
                  <h5 className="text-xl">
                    {lang.shipping_method || 'Shipping Method'}
                  </h5>
                  <div className="border border-gray-300 rounded-xl p-4 mt-4 flex gap-2 items-center">
                    {isLoadingEstimationCost ? (
                      <EstimationCostPlaceHolder />
                    ) : (
                      <>
                        {extraCostList?.length == 0 ? (
                          <p className="mb-0">
                            {lang.no_shipping_is_available_in_that_address ||
                              'No shipping is available in that address'}
                          </p>
                        ) : (
                          <div>
                            {extraCostList.map((item, index) => {
                              if (
                                item.method_title == 'Free' &&
                                customer?.addresses?.default_shipping
                                  ?.country_id != 'QA'
                              ) {
                                return null;
                              }
                              return (
                                <div
                                  key={index}
                                  className="cal-radio flex items-center">
                                  <div
                                    onClick={() => {
                                      completeCostFunc(item);
                                      setShippingMethodSelected(true);
                                    }}
                                    className={`radio-div ${
                                      estimatePrice?.shipping_carrier
                                        ?.shipping_price === item.price_excl_tax
                                        ? 'selected'
                                        : ''
                                    }`}
                                    id={`extraCostId${index + 1}`}>
                                    <div
                                      className={`radio-circle ${
                                        estimatePrice?.shipping_carrier
                                          ?.shipping_price ===
                                        item.price_excl_tax
                                          ? 'bg-primary'
                                          : ''
                                      }`}>
                                      {/* Show MdiCheck icon when selected */}
                                      {estimatePrice?.shipping_carrier
                                        ?.shipping_price ===
                                        item.price_excl_tax && (
                                        <Check className="text-white" />
                                      )}
                                    </div>
                                  </div>

                                  <label
                                    htmlFor={`extraCostId${index + 1}`}
                                    className="ml-2">
                                    {item.carrier_title}:{' '}
                                    <span className="text-green-500">
                                      {item.price_excl_tax == 0
                                        ? 'Free'
                                        : item.method_title +
                                          ' (' +
                                          currentCurrency +
                                          ' ' +
                                          _.round(
                                            item.price_excl_tax * currencyRate,
                                            2,
                                          ) +
                                          ')'}
                                    </span>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
                <PaymentBtnPlaceholder />
              ) : (
                paymentMethods.length > 0 &&
                shippingMethodSelected && (
                  <div className="mt-4 flex gap-2">
                    {/* <Button
                      variant="secondary"
                      disabled={isLoadingCompleteShippingCost}
                      className="mb-3">
                      {lang.checkout || 'Checkout'}
                    </Button> */}
                    <Button
                      disabled={isLoadingCompleteShippingCost}
                      onClick={() =>
                        router.push(`/${lang.lang}/payment/${addressId}`)
                      }
                      className="hover:bg-black mb-3">
                      {lang.payment || 'Payment'}
                    </Button>
                  </div>
                )
              )}
            </div>
            <div className="lg:w-1/3 w-full">
              {estimatePrice != '' && (
                <div className="orderStatusCard mb-6 shadow-[0_0_10px_#e9d2da] border-gray-300 p-6 bg-white">
                  <h4>{lang.summary || 'Summary'}</h4>
                  <Calculation lang={lang} />
                </div>
              )}
              {cartList?.length > 0 && (
                <>
                  <div className="w-full shadow-[0_0_10px_#e9d2da] border-gray-300 p-6 bg-white">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="cart-items">
                        <AccordionTrigger className="font-semibold text-lg">
                          {lang.items_in_cart || 'Items In Cart'} (
                          {cartList.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 mt-2">
                            {cartList && cartList.length > 0 ? (
                              cartList.map(item => (
                                <CartItems
                                  key={item.item_id}
                                  item={item}
                                  lang={lang}
                                />
                              ))
                            ) : (
                              <p>{lang.no_items_found || 'No items found.'}</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {show && (
        <ShippingModal
          show={show}
          lang={lang}
          setShow={setShow}
          editAddressData={editAddressData}
          setEditAddressData={setEditAddressData}
          editableData={editableData}
        />
      )}
    </>
  );
};

export default ShippingAddressWrapper;
