'use client';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Calculation from '@/components/calculation';
import {useEffect} from 'react';
import {get} from '@/lib/utils';
import {useSearchParams} from 'next/navigation';
import moment from 'moment/moment';
import {useSelector} from 'react-redux';

const TrackOrderWrapper = ({lang, trackingData, orderDetails}) => {
  const itemId = localStorage.getItem('item_id');

  const itemDetails = orderDetails.items.find(item => item.item_id === itemId);

  const imgUrl = itemDetails?.image_url;

  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  return (
    <>
      <div className="bg-primary-gradient">
        <div className="container md:py-20 py-10">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="space-y-1">
              <h2 className="md:text-4xl text-2xl font-semibold mb-2">
                {lang.track_order}
              </h2>
              <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0 text-sm text-muted-foreground">
                {/* <p>Order ID: {orderDetails.order_id}</p> */}
                <small className="text-gray-600 md:text-xl text-base">
                  {lang.order_id}:{' '}
                  <span className="font-medium text-black">
                    {orderDetails.order_id}
                  </span>
                </small>
                <div className="flex items-center space-x-1">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-green-500">
                    Estimated Delivery: 02Sep, 2024
                  </span> */}
                </div>
              </div>
            </div>
            {/* <Button variant="outline" size="sm">
              Cancel Request
            </Button> */}
          </div>
          <div className="grid gap-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-6">
              <div className="flex flex-col col-span-4 gap-8">
                <div className="flex md:flex-row flex-col gap-8">
                  <div className="relative w-full sm:w-36 sm:h-36 mb-4 sm:mb-0">
                    <Image
                      src={imgUrl}
                      width={147}
                      height={147}
                      alt="Product"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                      {lang.order_date}:{' '}
                      <span className="font-medium">
                        {moment(
                          orderDetails.created_at,
                          'YYYY-MM-DD HH:mm:ss',
                        ).format('DD MMM, YYYY')}
                      </span>
                    </span>
                    <p className="text-base sm:text-lg mb-2">
                      {itemDetails.name}
                    </p>
                    <h4 className="text-lg sm:text-xl font-bold mb-4">
                      <span>{currentCurrency}</span>{' '}
                      {_.round(itemDetails.price * currencyRate, 2).toFixed(2)}
                    </h4>
                  </div>
                </div>

                <div className="relative h-[400px] w-full overflow-y-auto">
                  {/* Vertical line for the timeline */}
                  <div className="absolute left-4 top-0 h-full w-px bg-pink-200" />
                  <div className="space-y-8 relative">
                    {trackingData.undefined.info
                      .slice()
                      .reverse()
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4">
                          {/* Step number */}
                          <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                              index === 0
                                ? 'bg-pink-600 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                            {index + 1}
                          </div>
                          {/* Step details */}
                          <div>
                            <h3 className="font-medium">{entry.status}</h3>
                            <p className="text-sm text-muted-foreground">{`${entry.date}, ${entry.time}`}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.location}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 h-fit col-span-2">
                <Calculation lang={lang} />
              </div>
            </div>

            {/* <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                  Building No:165, zone: 51,G1 1<br />
                  New Industrial Area Al,
                  <br />
                  Rayyan - Qatar PO Box 35329
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Delivery Method</h3>
                <p className="text-sm text-green-500">Free (30 Days)</p>
              </div>
            </div> */}

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
                  {orderDetails.shipping_address ? (
                    <p className="text-sm text-muted-foreground">
                      {`${orderDetails.shipping_address.street.join(', ')},`}
                      <br />
                      {`${orderDetails.shipping_address.city}, ${orderDetails.shipping_address.region} - ${orderDetails.shipping_address.postcode}`}
                      <br />
                      {`${orderDetails.shipping_address.country_id}`}
                      <br />
                      {`${lang.phone}: ${orderDetails.shipping_address.telephone}`}
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
                  {orderDetails.shipping_description ||
                    'Delivery method not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrderWrapper;
