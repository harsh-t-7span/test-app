import {configureStore} from '@reduxjs/toolkit';
import currencySlice from '../slices/currencySlice';
import categorySlice from '../slices/categorySlice';
import cmsSlice from '../slices/cmsSlice';
import customerAuthSlice from '../slices/customerAuthSlice';
import productSlice from '../slices/productSlice';
import orderSlice from '../slices/orderSlice';
import searchProductSlice from '../slices/searchProductSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      customerData: customerAuthSlice,
      currencyData: currencySlice,
      categoryData: categorySlice,
      cmsData: cmsSlice,
      productData: productSlice,
      searchProductData: searchProductSlice,
      orderData: orderSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export const store = makeStore();
