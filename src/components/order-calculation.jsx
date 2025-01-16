import _ from 'lodash';
import React from 'react';
import {useSelector} from 'react-redux';

const OrderCalculation = ({estimatePrice, lang}) => {
  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  return (
    <>
      <div className="space-y-7 text-sm py-7 border-b">
        <div className=" flex justify-between gap-1">
          <span>{lang.subtotal}</span>

          <strong>
            {currentCurrency}{' '}
            {estimatePrice?.sub_total
              ? _.round(
                  Number(estimatePrice?.sub_total) * currencyRate,
                  2,
                ).toFixed(2)
              : _.round(
                  Number(estimatePrice?.subtotal) * currencyRate,
                  2,
                ).toFixed(2)}
          </strong>
        </div>

        <div className=" flex justify-between gap-1">
          {estimatePrice?.shipping_amount == 0 ? (
            <span>
              {lang.shipping} {lang.store_pickup}
              <span className="text-green-500">- {lang.free}</span>
            </span>
          ) : (
            <span>
              {lang.shipping} ({lang.doorstep_delivery}
              <span className="text-green-500">- {lang.fixed}</span>)
            </span>
          )}

          <strong className="flex-none">
            {Number(estimatePrice?.shipping_amount) == 0
              ? Number(estimatePrice?.shipping_amount)
              : `${currentCurrency}
                    ${_.round(
                      estimatePrice?.shipping_amount * currencyRate,
                      2,
                    ).toFixed(2)}`}
          </strong>
        </div>

        <div className=" flex justify-between gap-1">
          <span>{lang.tax}</span>
          <strong>
            {Number(estimatePrice?.tax_amount) == 0
              ? Number(estimatePrice?.tax_amount)
              : `${currentCurrency}
                    ${_.round(
                      Number(estimatePrice?.tax_amount) * currencyRate,
                      2,
                    ).toFixed(2)}`}
          </strong>
        </div>
      </div>

      {Number(estimatePrice?.discount_amount) != 0 && (
        <div>
          <span>{lang.discount}</span>

          <strong>
            `${currentCurrency}$
            {_.round(
              Number(estimatePrice?.discount_amount) * currencyRate,
              2,
            ).toFixed(2)}
            `
          </strong>
        </div>
      )}
      <h6 className="flex justify-between text-2xl font-semibold pt-6">
        {lang.total_amount}
        <span className="text-primary font-semibold">
          {currentCurrency}{' '}
          {_.round(
            Number(estimatePrice?.grand_total) * currencyRate,
            2,
          ).toFixed(2)}
        </span>
      </h6>
    </>
  );
};

export default OrderCalculation;
