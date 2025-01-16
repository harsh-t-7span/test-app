import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {createSlug} from '../lib/utils';
import {useRouter} from 'next-nprogress-bar';

const CartItems = ({item, lang}) => {
  const router = useRouter();

  const colorFunc = color => {
    if (typeof color == 'string') {
      let colorArr = color.split(',');
      if (colorArr.length == 1) {
        return color;
      } else {
        return `linear-gradient(to bottom, ${colorArr[0]} 0%, ${colorArr[1]} 100%)`;
      }
    } else {
      return `linear-gradient(to bottom, ${color?.color_code[0]} 0%, ${color?.color_code[1]} 100%)`;
    }
  };

  const handleViewDetails = item => {
    const productSlug = createSlug(item?.name);

    const categoryId = item.category[0].category_id;
    const categorySlug = item.category[0].url_key;

    router.push(
      `/${lang.lang}/${categorySlug}/${categoryId}/${productSlug}/${item.parent_sku}`,
    );
  };
  return (
    <>
      <div key={item.item_id} className="flex items-start gap-2 space-x-4 p-4">
        <Image
          className="rounded-md object-cover"
          src={item.image}
          width={90}
          height={90}
          alt=""
        />
        <div className="flex-1">
          <h5 className="text-lg font-semibold mb-2">{item.name}</h5>
          {item.options
            ?.filter(item => item.label != 'Upload Artwork')
            .map((category, index) => {
              let printValue = category.value;
              if (typeof category.print_value == 'object') {
                printValue = category.print_value?.title;
              }

              return (
                <p
                  key={index}
                  className={`text-sm mb-1 ${
                    category.label === 'Color' ? 'flex items-center gap-2' : ''
                  }`}>
                  <strong className="font-medium">{category.label}:</strong>{' '}
                  {category.label == 'Color' ? (
                    <span
                      style={{
                        background: colorFunc(category.print_value),
                      }}
                      className="inline-block w-3 h-3 rounded-full"
                    />
                  ) : (
                    printValue
                  )}
                </p>
              );
            })}
          {/* <Link
            // href={`/category-product/${item.product_id}/${item.sku}`}
            href={handleViewDetails(item)}
            className="text-primary text-sm">
            {lang.view_details || 'View Details'}
          </Link> */}
          <p
            className="text-primary text-sm cursor-pointer"
            onClick={() => handleViewDetails(item)}>
            {lang.view_details || 'View Details'}
          </p>
        </div>
      </div>
    </>
  );
};

export default CartItems;
