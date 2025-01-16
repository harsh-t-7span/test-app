'use client';

import Image from 'next/image';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMessage,
  estimationCost,
  getCartList,
  removeFromCart,
  completeShippingCost,
  addCoupon,
} from '@/lib/slices/productSlice';
import {State, City} from 'country-state-city';
import _ from 'lodash';
import {Button} from '@/components';
import cartNotFoundImg from '../../../public/images/shopping-cart.png';
import {useRouter} from 'next-nprogress-bar';
import {X} from 'lucide-react';
import {Alert, AlertDescription} from '../ui/alert';
import Calculation from '../calculation';
import {EstimationCostPlaceHolder} from '../SkeletonPlaceholder/skeletonPlaceholder';
import {Spinner} from '@/asset/icons/spinner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Input} from '@/components/ui/input';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Check} from '../../../public/icons';

const ShoppingCart = ({lang}) => {
  const {currentCurrency, currencyRate, countryList} = useSelector(
    state => state.currencyData,
  );

  const {customer, shippingAddressList, isLoggedIn} = useSelector(
    state => state.customerData,
  );

  const {
    cartId,
    cartList,
    isLoadingCartList,
    message,
    isError,
    estimatePrice,
    isLoadingEstimationCost,
    extraCostList,
    isLoadingCompleteShippingCost,
  } = useSelector(state => state.productData);

  const dispatch = useDispatch();
  const router = useRouter();

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountError, setDiscountError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    dispatch(clearMessage());
    cartDetails();
  }, [customer]);

  useEffect(() => {
    estimationCostFunc();
  }, [shippingAddressList]);

  const cartDetails = () => {
    if (typeof window != 'undefined') {
      dispatch(getCartList(customer?.customer_id));
    }
  };

  const estimationCostFunc = () => {
    let shippingData = shippingAddressList.filter(
      item => item.is_default_shipping == true,
    );
    if (shippingData.length > 0) {
      setCity(shippingData[0].city);
      setCountry(shippingData[0].country_id);
      setZipCode(shippingData[0].postcode);
      const estimationData = {
        address: {
          city: shippingData[0].city,
          country_id: shippingData[0].country_id,
          postcode: shippingData[0].postcode,
        },
      };
      dispatch(estimationCost(estimationData));
    }
  };

  const colorFunc = color => {
    if (typeof color == 'string') {
      let colorArr = color.split(',');
      if (colorArr.length == 1) {
        return color;
      } else {
        return `linear-gradient(to bottom, ${colorArr[0]} 0%, ${colorArr[1]} 100%)`;
      }
    } else {
      return `linear-gradient(to bottom, ${color?.color_code[0]} 0%, ${color?.color_code[1]} 100%)`;
    }
  };

  const removeFromCartFunc = id => {
    dispatch(removeFromCart(id))
      .unwrap()
      .then(data => {
        if (data) {
          dispatch(getCartList(customer?.customer_id));
        }
      })
      .catch(error => {
        console.error('product image failed:', error);
      });
  };

  const estimateFunc = value => {
    setZipCode(value);
    if (value.length > 3) {
      const estimationData = {
        address: {
          city: city,
          country_id: country,
          postcode: value,
        },
      };
      dispatch(estimationCost(estimationData));
    }
  };

  const completeCostFunc = item => {
    const data = {
      addressInformation: {
        shipping_address: {
          region: customer?.addresses?.default_shipping?.region?.region,
          region_id: customer?.addresses?.default_shipping?.region?.region_id,
          region_code:
            customer?.addresses?.default_shipping?.region?.region_code,
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
        },
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
    dispatch(completeShippingCost(data));
  };

  const addCouponFunc = () => {
    if (couponCode.trim() == '') {
      setDiscountError(true);
    } else {
      setDiscountError(false);
      const data = {
        cartId: cartId,
        //couponCode: 'ENBAT',
        couponCode: couponCode,
      };
      dispatch(addCoupon(data));
    }
  };

  const handleProceedToCheckout = useCallback(() => {
    if (router && !router.isReady) {
      router.push(`/${lang.lang}/shipping-address`);
    }
  }, [router]);

  const [errors, setErrors] = useState({
    country: '',
    stateProvince: '',
    zipCode: '',
  });

  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    // setShowModal(false);
    dispatch(clearMessage());
  };

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{lang.your_cart || 'Your Cart'}</h1>
        <Button
          variant="outline"
          className="text-pink-500 flex items-center justify-center"
          onClick={() => router.push(`/${lang.lang}/`)}>
          <span className="font-semibold ">←</span>
          {lang.update_cart || 'Update Cart'}
        </Button>
      </div>

      {message && isError && (
        <Alert
          className="mb-3"
          variant="destructive"
          onClose={() => dispatch(clearMessage())}>
          <button
            className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
            onClick={handleClose}>
            <X />
          </button>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {message && !isError && (
        <Alert className="mb-3" onClose={() => dispatch(clearMessage())}>
          <button
            className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
            onClick={handleClose}>
            <X />
          </button>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {!cartList || cartList?.length == 0 ? (
        <div className="text-center py-12">
          <Image
            src={cartNotFoundImg}
            alt="Product not found"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">
            {lang.your_cart_is_empty || 'Your cart is empty'}
          </h2>
          <p className="text-muted-foreground">
            {lang.your_cart_is_currently_empty_browse_our_products ||
              'Your cart is currently empty. Browse our products and add items to your cart to view them here.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 px-2.5 py-5">
            <div className=" hidden md:grid grid-cols-4 gap-4 mb-4 font-bold text-lg">
              <p className="col-span-2">
                {lang.product_name || 'Product Name'}
              </p>
              <p>
                {lang.product || 'Product'} {lang.sub_total || 'Sub-Total'}
              </p>
              <p>{lang.total || 'Total'}</p>
            </div>

            {cartList?.length > 0 &&
              cartList?.map(item => {
                let additionalCharge = 0;
                let quantity = item?.options?.find(
                  data => data?.label === 'Quantity',
                );

                let design = item?.options?.find(
                  data => data?.label === 'Design',
                );
                if (design !== undefined) {
                  additionalCharge = design?.price * currencyRate;
                }

                return (
                  <div
                    key={item.item_id}
                    className="border-t border-gray-200 py-6">
                    <div className="md:grid grid-cols-4 gap-4 space-y-4 md:space-y-0 relative">
                      <div className="flex gap-4 col-span-2">
                        <div className="w-24 h-24 relative shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            {item?.options?.length > 0 &&
                              item.options.map((category, index) => {
                                let printValue = category.value;
                                if (typeof category.print_value === 'object') {
                                  printValue = category.print_value?.title;
                                }

                                return (
                                  <p
                                    key={index}
                                    className={`list ${
                                      category.label === 'Color'
                                        ? 'd-flex w-100 align-items-center gap-2'
                                        : ''
                                    }`}>
                                    <strong>{category.label}:</strong>{' '}
                                    {category.label === 'Color' ? (
                                      <label
                                        style={{
                                          width: 12,
                                          height: 12,
                                          background: colorFunc(
                                            category.print_value,
                                          ),
                                        }}
                                        className="effColor"
                                      />
                                    ) : (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: printValue,
                                        }}></span>
                                    )}
                                  </p>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-sm flex w-full items-center md:block">
                        <p className="md:hidden mr-2">Product Sub-Total: </p>
                        {currentCurrency}{' '}
                        {_.round(Number(item.price) * currencyRate, 2).toFixed(
                          2,
                        )}
                      </div>
                      {/* <div className="flex items-start md:justify-be"> */}
                      <div className="font-bold text-sm flex w-full items-center md:block">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm flex w-full items-center">
                            <p className="md:hidden mr-2">Total: </p>
                            {currentCurrency}{' '}
                            {_.round(
                              (Number(item.base_row_total_incl_tax) +
                                Number(additionalCharge)) *
                                currencyRate,
                              2,
                            ).toFixed(2)}
                          </span>
                          <Button
                            variant="secondary"
                            className="rounded-full p-1 !size-5 absolute top-0 right-1 md:!relative md:top-auto md:right-auto"
                            size="icon"
                            onClick={() => removeFromCartFunc(item.item_id)}>
                            <X className="!size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Shipping Details */}
          <div className="lg:w-1/3">
            <div className="bg-white  p-6 shadow-[0_0_10px_#e9d2da] border-gray-300">
              <h2 className="text-xl font-semibold mb-4">
                {lang.choose_shipping_mode || 'Choose Shipping Mode:'}
              </h2>
              <div className="space-y-4">
                {/* Estimate Shipping and Tax */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="shipping-estimation">
                  <AccordionItem value="shipping-estimation">
                    <AccordionTrigger className="text-gray-700 font-medium">
                      {lang.estimate_shipping_and_tax ||
                        'Estimate Shipping and tax'}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">
                            {lang.country || 'Country'}
                          </Label>
                          <Select onValueChange={setCountry} value={country}>
                            <SelectTrigger
                              id="country"
                              className={
                                errors.country ? 'border-destructive' : ''
                              }>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryList.map((item, index) => (
                                <SelectItem key={index} value={item.id}>
                                  {item.full_name_english}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.country && (
                            <p className="text-destructive text-xs">
                              {errors.country}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">{lang.city || 'City'}</Label>
                          <Select onValueChange={setCity} value={city}>
                            <SelectTrigger
                              id="city"
                              className={
                                errors.city ? 'border-destructive' : ''
                              }>
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                              {City.getCitiesOfCountry(country).map(
                                (item, index) => (
                                  <SelectItem key={index} value={item.name}>
                                    {item.name || 'City'}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          {errors.city && (
                            <p className="text-destructive text-xs">
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="zipCode">
                            {lang.zip_code || 'Zip/Postal Code'}
                          </Label>
                          <Input
                            id="zipCode"
                            type="text"
                            placeholder={lang.zip_code || 'Zip/Postal Code'}
                            value={zipCode}
                            onChange={e => estimateFunc(e.target.value)}
                            className={
                              errors.zipCode ? 'border-destructive' : ''
                            }
                            onKeyDown={e => {
                              if (
                                !/[0-9]/.test(e.key) &&
                                e.key !== 'Backspace' &&
                                e.key !== 'ArrowLeft' &&
                                e.key !== 'ArrowRight' &&
                                e.key !== 'Tab'
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          {errors.zipCode && (
                            <p className="text-destructive text-xs">
                              {errors.zipCode}
                            </p>
                          )}
                        </div>

                        <div className="mt-3">
                          {isLoadingEstimationCost ? (
                            <EstimationCostPlaceHolder />
                          ) : (
                            <>
                              {extraCostList?.length == 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  {lang.no_shipping_is_available_in_that_address ||
                                    'No shipping is available in that address'}
                                </p>
                              ) : (
                                <>
                                  {extraCostList?.length > 0 &&
                                    extraCostList.map((item, index) => {
                                      if (
                                        item.method_title == 'Free' &&
                                        country != 'QA'
                                      ) {
                                        return null;
                                      }
                                      return (
                                        <div
                                          key={index}
                                          onClick={() => {
                                            completeCostFunc(item);
                                          }}
                                          className={`shoppingRadio radio-btn-center mb-1 ${
                                            estimatePrice?.shipping_carrier
                                              ?.shipping_price ===
                                            item.price_excl_tax
                                              ? 'selected'
                                              : ''
                                          }`}
                                          id={`extraCostId${index + 1}`}>
                                          <div className="flex items-center space-x-1 cal-radio">
                                            <div
                                              className={`radio-circle ${
                                                estimatePrice?.shipping_carrier
                                                  ?.shipping_price ===
                                                item.price_excl_tax
                                                  ? 'bg-primary'
                                                  : ''
                                              }`}>
                                              {estimatePrice?.shipping_carrier
                                                ?.shipping_price ===
                                                item.price_excl_tax && (
                                                <Check className="text-white" />
                                              )}
                                            </div>
                                            <label
                                              htmlFor={`extraCostId${
                                                index + 1
                                              }`}>
                                              <b className="-mt-px ml-1">
                                                {item.carrier_title}:{' '}
                                              </b>
                                              <span className="text-green-500">
                                                {item.price_excl_tax == 0
                                                  ? lang.free || 'Free'
                                                  : item.method_title +
                                                    ' (' +
                                                    currentCurrency +
                                                    ' ' +
                                                    _.round(
                                                      Number(
                                                        item.price_excl_tax,
                                                      ) * currencyRate,
                                                      2,
                                                    ).toFixed(2) +
                                                    ')'}
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Apply Discount Code */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="discount-code">
                    <AccordionTrigger className="text-gray-700 font-medium">
                      {lang.apply} {lang.discount} {lang.code}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder={
                            lang.enter_discount_code || 'Enter Discount Code'
                          }
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          className="w-full"
                        />
                        {discountError && (
                          <p className="text-destructive text-xs">
                            Please enter the discount code
                          </p>
                        )}
                        <Button
                          variant="secondary"
                          onClick={addCouponFunc}
                          className="w-full">
                          {lang.apply_discount || 'Apply Discount'}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Summary */}
                <Calculation lang={lang} setCouponCode={setCouponCode} />

                <Button
                  disabled={
                    isLoadingEstimationCost || isLoadingCompleteShippingCost
                  }
                  onClick={handleProceedToCheckout}
                  className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors text-sm font-medium">
                  {lang.proceed_to_checkout || 'Proceed To Checkout'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
