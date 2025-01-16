'use client';

import {Spinner} from '@/asset/icons/spinner';
import {Button} from '@/components';
import Calculation from '@/components/calculation';
import CartItems from '@/components/cart-items';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {useToast} from '@/hooks/use-toast';
import {SHIPMETHOD} from '@/lib/apis/keywords';
import {
  completeShippingCost,
  makeOrder,
  payPalPayment,
  payPalToken,
} from '@/lib/slices/productSlice';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState, useEffect} from 'react';
// import {Accordion, Spinner} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';

const PaymentWrapper = ({addressID, lang}) => {
  const dispatch = useDispatch();
  const {toast} = useToast();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const {customer, isLoggedIn, shippingAddressList} = useSelector(
    state => state.customerData,
  );

  const shippingAddressData = shippingAddressList.filter(
    item => item.id == addressID,
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const getAddressInformation = localStorage.getItem(SHIPMETHOD);
    if (getAddressInformation && isLoggedIn) {
      dispatch(completeShippingCost(JSON.parse(getAddressInformation)));
    } else {
      router.push('/');
    }
  }, []);

  const {
    cartList,
    cartId,
    estimatePrice,
    billingAddress,
    shippingAddress,
    paymentMethods,
    isPaymentLoading,
    shippingAddressId,
    shippingMethod,
    approvalUrl,
  } = useSelector(state => state.productData);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  const paymentFunc = () => {
    if (paymentMethod == 'paypal_express') {
      paypalPayment();
    } else {
      paymentFunc1();
      // router.push(`/payment/payment-success?paymentType=${paymentMethod}`);
    }
  };
  const paymentFunc1 = () => {
    const billingData = customer?.addresses?.default_billing;
    const data = {
      paymentMethod: {
        method: paymentMethod,
      },

      billingAddress: {
        region: billingData?.region?.region,
        region_id: billingData?.region?.region_id,
        region_code: billingData?.region?.region_code,
        country_id: billingData?.country_id,
        street: billingData?.street,
        postcode: billingData?.postcode,
        city: billingData?.city,
        firstname: billingData?.firstname,
        lastname: billingData?.lastname,
        customer_id: customer?.customer_id,
        email: customer?.email,
        telephone: billingData?.telephone,
      },

      cartId: cartId,
    };

    dispatch(makeOrder(data))
      .unwrap()
      .then(data => {
        router.replace(
          `https://papercut-api.preview.im/maktapp/Standard/Redirect/order_id/${data}`,
        );
        // window.open(
        //   `https://papercut-api.preview.im/maktapp/Standard/Redirect/order_id/${data}`,
        //   '_self',
        //   'noopener,noreferrer',
        // );
      })
      .catch(error => {
        console.error('Payment failed:', error);
        toast({
          variant: 'destructive',
          title: error,
        });
      });
  };

  const paypalPayment = () => {
    const data = {
      cart_id: cartId,
      customer_id: customer.customer_id,
      cancel_url: `${process.env.PAPERCUT_DOMAIN_URL}/${lang.lang}/payment/payment-cancelled/`,
      return_url: `${process.env.PAPERCUT_DOMAIN_URL}/${lang.lang}/payment/payment-success?paymentType=Paypal`,
      // cancel_url: `http://localhost:3000/${lang.lang}/payment/payment-cancelled/`,
      // return_url: `http://localhost:3000/${lang.lang}/payment/payment-success?paymentType=Paypal`,
    };

    dispatch(payPalToken(data))
      .unwrap()
      .then(data => {
        if (data[0].code === 200) {
          let url = data[0].paypal_urls.start;
          // window.open(url, '_self', 'noopener,noreferrer');
          router.replace(url);
        } else {
          toast({
            variant: 'destructive',
            title: data[0].message,
          });
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  };
  if (!isMounted) return null;
  return (
    <>
      <section className="py-12 bg-primary-gradient">
        <div className="container">
          <h2 className="pb-3 text-3xl font-bold border-b border-gray-400">
            {lang.checkout_and_payment || 'Checkout & Payment'}
          </h2>

          {!isLoggedIn && (
            <Link href={`/${lang.lang}/sign-in`} className="signin">
              Sign In
            </Link>
          )}

          <div className="w-full flex md:flex-row flex-col gap-5 justify-between">
            <div className="w-full md:w-3/5 space-y-5">
              <div className="flex gap-6 md:flex-row flex-col">
                <div className="p-5 border-2 border-zinc-100 rounded-lg flex-1">
                  <p className="font-bold">Billing Address</p>
                  <p className="text-sm mb-1">
                    {customer?.addresses?.default_billing?.street[0]}
                  </p>
                  <h3 className="text-xl text-primary">
                    {customer?.addresses?.default_billing?.telephone}
                  </h3>
                </div>

                <div className="p-5 border-2 border-zinc-100 rounded-lg flex-1">
                  <p className="font-bold">Shipping Address</p>
                  <p className="text-sm mb-1">
                    {shippingAddressData[0]?.street[0]}
                  </p>
                  <h3 className="text-xl text-primary">
                    {shippingAddressData[0]?.telephone}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold">
                  {lang.payment_method || 'Payment Method'}
                </p>
                <div className="space-y-4">
                  {paymentMethods.length > 0 &&
                    paymentMethods.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            paymentMethod === item.code
                              ? 'border-primary bg-white'
                              : 'border-green-100 bg-green-50'
                          }`}>
                          <input
                            onChange={() => {
                              setPaymentMethod(item.code);
                            }}
                            className="caret-primary"
                            type="radio"
                            name="flexRadioDefault"
                            id={`flexRadio${item.code}`}
                            checked={paymentMethod == item.code}
                          />
                          <label className="" htmlFor={`flexRadio${item.code}`}>
                            <strong> {item.title}</strong>
                            <p>
                              {item.code == 'cashondelivery'
                                ? 'Cash on Delivery is available. You can pay for your order in cash when it is delivered.'
                                : 'Securely pay with your credit or debit card'}
                            </p>
                          </label>
                        </div>
                      );
                    })}
                </div>
                {paymentMethod != '' && (
                  <div className="row">
                    <div className="col-lg-12 text-end">
                      <Button
                        onClick={() => paymentFunc()}
                        disabled={isPaymentLoading}
                        className="hover:bg-pink-600 border hover:border-pink-600">
                        {isPaymentLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          lang.pay_now || 'Pay Now'
                        )}
                      </Button>
                      {/* <button className="commonButton  ">Cancel</button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-[38%]">
              {estimatePrice != '' && (
                <div className="orderStatusCard mb-6 shadow-[0_0_10px_#e9d2da] border-gray-300 p-4">
                  <h4>{lang.summary || 'Summary'}</h4>
                  <Calculation lang={lang} />
                </div>
              )}
              {cartList.length > 0 && (
                <>
                  <div className="w-full shadow-[0_0_10px_#e9d2da] border-gray-300 p-4">
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
    </>
  );
};

export default PaymentWrapper;
