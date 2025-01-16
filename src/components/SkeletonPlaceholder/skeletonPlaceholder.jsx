import React from 'react';

export const ProductPlaceholder = () => {
  return (
    <div className="animate-pulse bg-white shadow rounded-lg">
      <div className="p-3">
        <div className="flex">
          <div className="flex-1 flex flex-col items-start">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="flex-1 flex flex-col items-end space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        </div>
      </div>
      <div className="h-72 bg-gray-200 rounded w-full"></div>
      <div className="p-3 text-center">
        <h5 className="mb-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </h5>
        <div className="mt-3">
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="mt-5">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const CmsPlaceholder = () => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="h-6 bg-gray-200 rounded w-5/12"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-3/12"></div>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <div className="h-6 bg-gray-200 rounded w-4/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-7/12"></div>
        <div className="h-4 bg-gray-200 rounded w-2/12"></div>
      </div>
    </div>
  );
};

export const WishlistPlaceholder = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 4}, (_, index) => (
            <tr key={index}>
              <td className="p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="p-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CartlistPlaceholder = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </th>
            <th className="p-2 text-right">
              <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 2}, (_, index) => (
            <tr key={index}>
              <td className="p-2">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex flex-col space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="p-2">
                <div className="flex items-center justify-end space-x-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TotalAmountPlaceholder = () => {
  return (
    <div className="space-y-4">
      {['Subtotal', 'Shipping', 'Tax', 'Discount', 'Order Total'].map(
        (item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{t(item)}</span>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ),
      )}
    </div>
  );
};

export const ProductDetailsPlaceholder = () => {
  return (
    <section className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-5/12 px-4 mb-8 lg:mb-0">
            <div className="relative pb-3/4">
              <div className="absolute inset-0 bg-gray-200 rounded"></div>
            </div>
            <div className="flex mt-4 space-x-2">
              {Array.from({length: 4}, (_, index) => (
                <div
                  key={index}
                  className="w-1/4 pb-1/4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-7/12 px-4">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
              {Array.from({length: 4}, (_, index) => (
                <div key={index} className="border-t border-gray-200 py-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex space-x-2">
                      {Array.from({length: 4}, (_, i) => (
                        <div
                          key={i}
                          className="h-8 bg-gray-200 rounded w-16"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ReviewPlaceholder = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="flex space-x-1">
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                className="h-5 w-5 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
      {Array.from({length: 3}, (_, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="flex items-center space-x-1">
                {Array.from({length: 5}, (_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 bg-gray-200 rounded-full"></div>
                ))}
                <div className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
};

export const ProductDetailsImagePlaceholder = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative pb-3/4 mb-4">
          <div className="absolute inset-0 bg-gray-200 rounded"></div>
        </div>
        <div className="flex space-x-2">
          {Array.from({length: 3}, (_, index) => (
            <div key={index} className="w-1/4 pb-1/4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const MenuPlaceholder = () => {
  return (
    <div className="flex justify-end space-x-4">
      {Array.from({length: 10}, (_, index) => (
        <div key={index} className="h-4 bg-gray-200 rounded w-16"></div>
      ))}
    </div>
  );
};

export const EstimationCostPlaceHolder = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export const OrderPlaceholder = () => {
  return (
    <div className="space-y-4">
      {Array.from({length: 2}, (_, index) => (
        <div key={index} className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PaymentBtnPlaceholder = () => {
  return (
    <div className="space-y-4 mt-8">
      <div className="h-12 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
    </div>
  );
};
