import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {removeCoupon} from '@/lib/slices/productSlice';
import {XCircle} from 'lucide-react';
import {Spinner} from '@/asset/icons/spinner';

const Calculation = ({lang, setCouponCode}) => {
  const {currentCurrency, currencyRate, countryList} = useSelector(
    state => state.currencyData,
  );

  const {
    cartId,
    isLoadingCartList,
    estimatePrice,
    cartList,
    isLoadingEstimationCost,
    isLoadingCompleteShippingCost,
  } = useSelector(state => state.productData);

  const dispatch = useDispatch();

  const removeCouponFunc = () => {
    setCouponCode('');
    const data = {
      cartId: cartId,
    };
    dispatch(removeCoupon(data));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{lang.subtotal || 'Subtotal'}</span>
        {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <strong className="text-gray-900">
            {currentCurrency}{' '}
            {_.round(
              Number(estimatePrice?.sub_total * currencyRate || 0),
              2,
            ).toFixed(2)}
          </strong>
        )}
      </div>

      <div className="flex justify-between gap-4 items-center text-sm">
        {estimatePrice?.shipping_carrier?.shipping_price == 0 ? (
          <span className="text-gray-600">
            {lang.shipping || 'Shipping'} ({lang.store_pickup || 'Store Pickup'}{' '}
            - <span className="text-green-500">{lang.free || 'Free'}</span>)
          </span>
        ) : (
          <span className="text-gray-600">
            {lang.shipping || 'Shipping'} (
            {lang.doorstep_delivery || 'Doorstep Delivery'} -{' '}
            <span className="text-green-500">{lang.fixed || 'Fixed'}</span>)
          </span>
        )}
        {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
          <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <strong className="text-gray-900">
            {Number(estimatePrice?.shipping_carrier?.shipping_price) == 0
              ? Number(estimatePrice?.shipping_carrier?.shipping_price)
              : `${currentCurrency} ${_.round(
                  estimatePrice?.shipping_carrier?.shipping_price *
                    currencyRate,
                  2,
                ).toFixed(2)}`}
          </strong>
        )}
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{lang.tax || 'Tax'}</span>
        {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
          <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <strong className="text-gray-900">
            {Number(estimatePrice?.tax_amount) == 0
              ? Number(estimatePrice?.tax_amount)
              : `${currentCurrency} ${_.round(
                  Number(estimatePrice?.tax_amount) * currencyRate,
                  2,
                ).toFixed(2)}`}
          </strong>
        )}
      </div>

      {Number(estimatePrice?.discountAmount) != 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{lang.discount || 'Discount'}</span>
          {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-center">
              <strong className="text-gray-900 mr-2">
                {estimatePrice?.discountAmount == '0.0000'
                  ? estimatePrice.discountAmount
                  : `${currentCurrency} ${_.round(
                      Number(estimatePrice?.discountAmount) * currencyRate,
                      2,
                    ).toFixed(2)}`}
              </strong>
              <button
                className="text-red-500 hover:text-red-700 transition-colors"
                onClick={removeCouponFunc}>
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <h6 className="text-lg font-bold text-gray-900">
          {lang.total_amount || 'Total Amount'}
        </h6>
        {isLoadingEstimationCost || isLoadingCompleteShippingCost ? (
          <div className="w-24 h-7 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <span className="text-lg font-bold text-primary flex-none">
            {currentCurrency}{' '}
            {_.round(
              Number(estimatePrice?.grand_total) * currencyRate,
              2,
            ).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Calculation;
