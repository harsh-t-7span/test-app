'use client';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCartList} from '@/lib/slices/productSlice';
import {
  getShippingAddressList,
  getCustomerProfile,
} from '@/lib/slices/customerAuthSlice';
import {PROFILE, TOKEN} from '@/lib/apis/keywords';
import Cookies from 'js-cookie';

const ClientData = () => {
  const dispatch = useDispatch();
  const {customer, isLoggedIn} = useSelector(state => state.customerData);

  const saveAddressId = () =>
    Cookies.set('addressId', customer?.addresses?.default_billing?.id);

  const loadCustomerData = () => {
    if (typeof window === 'undefined') return;

    const profile = Cookies.get(PROFILE)
      ? JSON.parse(Cookies.get(PROFILE))
      : null;

    dispatch(getCustomerProfile(profile?.customer_id))
      .unwrap()
      .then(data => {
        if (data?.success) {
          // localStorage.setItem(PROFILE, JSON.stringify(data.customer));
          Cookies.set(PROFILE, JSON.stringify(data.customer));
        }
      })
      .catch(error => {
        console.error('Get profile failed:', error);
      });

    const customerId = profile?.customer_id || customer?.customer_id;
    if (customerId) {
      dispatch(getCartList(customerId));
      dispatch(getShippingAddressList(customerId));
    }
  };

  useEffect(() => {
    if (isLoggedIn || customer?.customer_id) {
      loadCustomerData();
      saveAddressId();
    }
  }, [dispatch, customer?.customer_id, isLoggedIn]);

  return null;
};

export default ClientData;
