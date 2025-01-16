'use client';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {makeOrder, payPalSuccess} from '@/lib/slices/productSlice';
import {orderDetails} from '@/lib/slices/orderSlice';
import {Spinner} from '@/asset/icons/spinner';
import {useRouter} from 'next-nprogress-bar';
//import './index.css';

const PaymentSuccessWrapper = ({lan}) => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('token');
  const payerID = searchParams.get('PayerID');
  const paymentType = searchParams.get('paymentType');

  const fatoraTransactionId = searchParams.get('transid');
  const fatoraOrderId = searchParams.get('orderId');
  const fatoraPayerId = searchParams.get('emailID');
  const fatoraAmount = searchParams.get('amount');

  const dispatch = useDispatch();
  const router = useRouter();
  const {customer, isLoggedIn} = useSelector(state => state.customerData);
  const {isOrderLoading, message, isError, orderData} = useSelector(
    state => state.orderData,
  );

  const {isPaymentLoading} = useSelector(state => state.productData);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window != 'undefined' && paymentType != null) {
      paymentSuccessFunc();
      //dispatch(orderDetails('2955'));
    }
  }, [paymentType]);

  const paymentSuccessFunc = () => {
    if (paymentType == 'Paypal') {
      const paymentMethod = {
        method: 'paypal_express',
        additional_data: {
          paypal_express_checkout_token: paymentId,
          paypal_express_checkout_redirect_required: true,
          paypal_express_checkout_payer_id: payerID,
        },
      };
      orderFunc(paymentMethod);
    } else {
      let paymentData = {
        method: paymentType,
      };
      orderFunc(paymentData);
    }
  };

  const orderFunc = paymentMethod => {
    const billingData = customer?.addresses?.default_billing;
    const data = {
      paymentMethod: paymentMethod,
      billing_address: {
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
    };

    dispatch(makeOrder(data))
      .unwrap()
      .then(data => {
        if (data) {
          localStorage.removeItem('cartData');
          dispatch(orderDetails(data));
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  if (!isMounted) return null;
  return (
    <section className="bg-primary-gradient">
      <div className="flex justify-center items-center container min-h-[calc(100vh-176px)]">
        {isOrderLoading || isPaymentLoading ? (
          <div className="text-center payment-loader">
            <Spinner animation="border" />
            <span>{lan.please_wait_order_is_in_progress}</span>
          </div>
        ) : (
          <div className="bg-white max-w-xs lg:max-w-xl lg:min-w-[560px] rounded-md border-2 border-green-500 px-16 py-12 text-center">
            <div className="p-3 rounded-full w-fit bg-green-100 mx-auto mb-6">
              <div className="p-5 rounded-full w-fit bg-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl text-green-500 font-bold pb-4">
              {lan.payment_successful}
            </h3>
            <p className="font-bold">
              {lan.transaction_id}:{' '}
              <span className="font-medium">
                {orderData?.payment?.last_trans_id || fatoraTransactionId}
              </span>
            </p>
            <p className="font-bold mb-6">
              {lan.order_id}:{' '}
              <Link
                className="font-medium text-blue-600"
                href={`/orders/order-details/${
                  orderData?.order_id || fatoraOrderId
                }`}>
                {orderData?.order_id || fatoraOrderId}
              </Link>
            </p>
            <p className="border-t border-dashed border-gray-300 py-3 text-left flex items-center justify-between gap-2">
              <span className="font-semibold">{lan.amount_paid}</span>
              <span className="text-sm">
                {orderData?.currency} {orderData?.grand_total || fatoraAmount}
              </span>
            </p>
            <p className="border-t border-dashed border-gray-300 py-3 mb-6 text-left flex items-center justify-between gap-2">
              <span className="font-semibold">{lan.payed_by}</span>
              <span className="text-sm">
                {orderData?.payment_method?.method || fatoraPayerId}
              </span>
            </p>
            <Link
              href={`/${lan.lang}/`}
              className="bg-black px-6 py-2 rounded-md text-white">
              {lan.back}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentSuccessWrapper;
