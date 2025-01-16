'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import PreFooter from '@/components/PreFooter/preFooter';

const OrderViewWrapper = ({lang}) => {
  const router = useRouter();

  const handleTrackOrder = () => {
    router.push('/track-order');
  };

  return (
    <>
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="mb-2">
              <h2 className="text-2xl font-bold">
                Order ID: <span className="font-normal">3258998754</span>
              </h2>
              <small className="text-gray-600">28 Aug, 2024</small>
            </div>
          </div>
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex border-b">
                <button className="flex-1 py-2 px-4 text-center border-b-2 border-blue-500 font-medium text-blue-500">
                  Items Ordered
                </button>
                <button className="flex-1 py-2 px-4 text-center text-gray-600 hover:text-gray-800">
                  Invoices
                </button>
                <button className="flex-1 py-2 px-4 text-center text-gray-600 hover:text-gray-800">
                  Order Shipments
                </button>
                <button className="flex-1 py-2 px-4 text-center text-gray-600 hover:text-gray-800">
                  Refunds
                </button>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full lg:w-2/3 px-4 mb-6 lg:mb-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">
                              Product Name
                            </th>
                            <th className="py-2 px-4 text-left">Sub-total</th>
                            <th className="py-2 px-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2].map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  {/* <Image
                                    alt=""
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 object-cover mr-4"
                                    src="https://papercut.mydevfactory.com/pub/media/catalog/product/b/u/busi-card.jpg"
                                  /> */}
                                  <div>
                                    <h6 className="font-medium">
                                      Business Card
                                    </h6>
                                    <p className="text-sm text-gray-600">
                                      <strong>Shape (cms):</strong> 5.5 x 9
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Printing:</strong> Single Side
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Finishing:</strong> Gloss
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Special Effects:</strong> Foil
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Quantity:</strong> 250
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Delivery:</strong> Standard
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm font-medium">
                                GBP 38.50
                              </td>
                              <td className="py-4 px-4 text-sm font-medium text-right">
                                GBP 38.50
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/3 px-4">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                      <h4 className="text-lg font-medium mb-4">
                        Order History{' '}
                        <small className="text-gray-600">(2 Items)</small>
                      </h4>
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <strong>QAR 350.00</strong>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>
                          Shipping Store Pickup -{' '}
                          <span className="text-green-500">Free</span>
                        </span>
                        <strong>QAR 50.00</strong>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Discount of MRP</span>
                        <strong>QAR 30.00</strong>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4">
                        <span>Total Amount</span>
                        <span>QAR 5350.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h5 className="text-xl font-medium mb-4">Order Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                'Shipping Address',
                'Shipping Method',
                'Billing Address',
                'Payment Method',
              ].map((title, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <h5 className="font-medium mb-2">{title}</h5>
                  <p className="text-sm text-gray-600">
                    {title === 'Payment Method' ? (
                      <span className="text-green-500">Free (30 Days)</span>
                    ) : (
                      'Building No:165. zone: 81,St 1 New Industrial Area Al Rayyan - Qatar PO Box 30328'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PreFooter lang={lang} />
    </>
  );
};

export default OrderViewWrapper;
