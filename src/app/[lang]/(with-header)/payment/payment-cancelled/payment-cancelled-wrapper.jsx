import React from 'react';
import Link from 'next/link';

const PaymentCancelledWrapper = ({lang}) => {
  return (
    <section className="bg-primary-gradient">
      <div className="flex justify-center items-center container min-h-[calc(100vh-176px)]">
        <div className="bg-white max-w-xs lg:max-w-xl lg:min-w-[560px] rounded-md border-2 border-red-500 px-16 py-12 text-center space-y-4">
          <div className="p-3 rounded-full w-fit bg-red-100 mx-auto mb-6">
            <div className="p-3 rounded-full w-fit bg-red-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-alert">
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl text-red-500 font-bold pb-4 border-b border-dashed border-gray-300">
            {lang.payment_cancelled}
          </h3>
          <p className="pb-6">
            {lang.your_bill_payment_was_cancelled_successfully}
          </p>
          <Link
            href={`/${lang.lang}/`}
            className="bg-black px-6 py-2 rounded-md text-white">
            {lang.back}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelledWrapper;
