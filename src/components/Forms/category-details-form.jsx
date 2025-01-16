'use client';

import {Button} from '..';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {useRouter} from 'next-nprogress-bar';
import {
  clearMessage,
  getQuoteId,
  addToCart,
  addToWishlist,
  resetIsAddedToCart,
  resetIsAddedToWishlist,
  setDetailsAddToWistlist,
  getProductImages,
} from '@/lib/slices/productSlice';
import _ from 'lodash';
import {ProductDetailsPlaceholder} from '../SkeletonPlaceholder/skeletonPlaceholder';

import StandardIcon from '/public/images/standard.png';
import ExpressIcon from '/public/images/express.png';
import UrgentIcon from '/public/images/urgent.png';
import Image from 'next/image';
import {Alert, AlertDescription} from '../ui/alert';
import Link from 'next/link';
import {ShoppingCart, X} from 'lucide-react';
import CategoryDetailCarousel from '../Carousel/category-detail-carousel';

export default function CategoryDetailsForm({lang, productId}) {
  const {productDetails} = useSelector(state => state.productData);
  const carouselImage = productDetails?.media_gallery_entries?.map(item => ({
    src: item.file,
    thumbnail: item.file,
    alt: 'Product Image',
  }));
  const [activeTab, setActiveTab] = useState('customize');
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const [apiProductImages, setApiProductImages] = useState([]);

  const handleClose = () => {
    setIsVisible(false);
    dispatch(clearMessage());
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, [productDetails, dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'customize':
        return (
          <CustomizeForm
            productDetails={productDetails}
            productId={productId}
            lang={lang}
            getMediaImages={getMediaImages}
          />
        );
      case 'specification':
        return (
          <SpecificationForm productDetails={productDetails} lang={lang} />
        );
      default:
        return null;
    }
  };

  const getMediaImages = images => {
    setApiProductImages(images);
  };

  const {isLoadingProductDetailsById, message, isError} = useSelector(
    state => state.productData,
  );

  return isLoadingProductDetailsById ? (
    <ProductDetailsPlaceholder />
  ) : (
    <div className="container lg:grid lg:grid-cols-2 justify-center my-4 gap-6 ">
      <div className="">
        <CategoryDetailCarousel
          carouselImage={carouselImage}
          apiProductImages={apiProductImages}
        />
      </div>

      <div className="mt-8 lg:mt-0 ">
        <div className="text-primary text-lg lg:text-xl mb-2">
          SKU No.: <span className="font-semibold">{productDetails?.sku}</span>{' '}
        </div>

        {message && isError && (
          <Alert
            className="mb-3 bg-red-200"
            variant="destructive"
            onClose={() => dispatch(clearMessage())}>
            <button
              className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
              onClick={handleClose}>
              <X />
            </button>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {message && !isError && (
          <Alert
            className="mb-3 bg-green-200"
            onClose={() => dispatch(clearMessage())}>
            <button
              className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
              onClick={handleClose}>
              <X />
            </button>
            <AlertDescription>
              {message}
              {!isError &&
                message === `You added ${productDetails?.name} to your` && (
                  <Link
                    className="ms-1 text-blue-800"
                    href={`/${lang.lang}/shopping-cart`}>
                    {lang.shopping_cart}
                  </Link>
                )}
              {!isError &&
                message === `${productDetails?.name} added to your` && (
                  <Link className="ms-1" href="/wishlist">
                    {lang.wishlist}
                  </Link>
                )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex border-b border-gray-300 gap-6 my-4">
          <button
            className={`py-2 font-semibold border-b-2 ${
              activeTab === 'customize'
                ? 'border-primary text-secondary'
                : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('customize')}>
            {lang.customize_personalize}
          </button>
          <button
            className={`py-2 font-semibold border-b-2 ${
              activeTab === 'specification'
                ? 'border-primary text-secondary'
                : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('specification')}>
            {lang.specification}
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

const CustomizeForm = ({productDetails, productId, lang, getMediaImages}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {isLoggedIn, customer} = useSelector(state => state.customerData);
  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
  );

  const {
    quoteId,
    isLoadingAddToCart,
    isAddedToCart,
    isLoadingAddToWishlist,
    isAddedToWishlist,
    is_in_wishlist,
  } = useSelector(state => state.productData);

  const [showRequired, setShowRequired] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [optionData, setOptionData] = useState([]);
  const [uploadFile, setUploadFile] = useState(false);
  const [designPrice, setDesignPrice] = useState(0);
  const [showColor, setShowColor] = useState(false);
  const [configurableOptionData, setConfigurableOptionData] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [printed, setPrinted] = useState(true);

  getMediaImages(productImages);

  const deliveryIcons = {
    Standard: StandardIcon,
    Express: ExpressIcon,
    Urgent: UrgentIcon,
  };

  useEffect(() => {
    dispatch(getQuoteId());
  }, [productId]);

  const optionsValidatorData = item => {
    // Manage selected required options
    const tempItemArr = selectedValue.filter(
      data =>
        data.optionId !== item.option_id || data.optionId !== item.attribute_id,
    );
    // Add the required option and whether it's selected
    const selectedItem = {
      optionId: item.option_id || item.attribute_id,
      isRequired: item.is_require,
    };
    setSelectedValue([...tempItemArr, selectedItem]);
  };

  const colorFunc = color => {
    if (typeof color == 'string') {
      let colorArr = color.split(',');
      if (colorArr.length == 1) {
        return colorArr[0];
      } else {
        return `linear-gradient(to bottom, ${colorArr[0]} 0%, ${colorArr[1]} 100%)`;
      }
    } else {
      return `linear-gradient(to bottom, ${color?.color_code[0]} 0%, ${color?.color_code[1]} 100%)`;
    }
  };

  const addDataFunc = (item, i) => {
    if (item.title == 'Quantity') {
      setQuantity(i.title);
    }
    let tempArr = [];
    tempArr = optionData.filter(data => data.optionId != item.option_id);

    let temp = {
      optionId: item.option_id,
      optionValue: i.option_type_id,
    };
    tempArr.push(temp);
    setOptionData([...tempArr]);
    optionsValidatorData(item);
  };

  const addCommentFunc = (item, text) => {
    let tempArr = [];
    tempArr = optionData.filter(data => data.optionId != item.option_id);

    let temp = {
      optionId: item.option_id,
      optionValue: text,
    };
    tempArr.push(temp);
    setOptionData([...tempArr]);
  };

  const addFile = (item, image) => {
    let tempArr = [];
    tempArr = optionData.filter(data => data.optionId != item.option_id);
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      let temp = {
        optionId: item.option_id,
        optionValue: 'file',
        extension_attributes: {
          file_info: {
            base64_encoded_data: reader.result.split(',')[1],
            type: image.type,
            name: image.name,
          },
        },
      };
      tempArr.push(temp);
      setOptionData([...tempArr]);
    };
  };

  const designAdditionalFunc = data => {
    if (data.price == 0) {
      setDesignPrice(0);
      setUploadFile(true);
    } else {
      setDesignPrice(data.price * currencyRate);
      setUploadFile(false);
    }
  };

  const addConfigurableAttribute = (item, i) => {
    if (item.label == 'Quantity') {
      setQuantity(i.label);
    }
    let tempArr = [];
    tempArr = configurableOptionData.filter(
      data => data.option_id != item.attribute_id,
    );
    let temp = {
      option_id: item.attribute_id,
      option_value: i.value_index,
    };
    tempArr.push(temp);
    setConfigurableOptionData([...tempArr]);
    fetchImageFunc(tempArr);

    optionsValidatorData(item);
  };

  const fetchImageFunc = async tempArr => {
    let configArr = [];
    tempArr.map(item => {
      let temp = {
        attribute_id: item.option_id,
        option_id: item.option_value,
      };
      configArr.push(temp);
    });
    const data = {
      data: {
        sku: productDetails.sku,
        options: configArr,
      },
    };
    setImageLoading(true);
    dispatch(getProductImages(data))
      .unwrap()
      .then(data => {
        if (data.id) {
          let imgArr = [];
          data?.media_gallery_entries?.map((item, index) => {
            let temp = {
              original: item.file,
              thumbnail: item.file,
            };
            imgArr.push(temp);
          });
          if (imgArr.length > 0) {
            setProductImages(imgArr);
          }
          setImageLoading(false);
        }
      })
      .catch(error => {
        console.error('product image failed:', error);
        setImageLoading(false);
      });
  };

  //Start add to cart list functions
  const addToCartFunc = () => {
    const data = {
      cart_item: {
        quote_id: typeof quoteId == 'object' ? quoteId.id : quoteId,
        sku: productDetails.sku,
        qty: 1,
        product_option: {
          extension_attributes: {
            custom_options: optionData,
            configurable_item_options: configurableOptionData,
          },
        },
      },
    };

    const selectedOptionValid = selectedValue.some(
      val => val.optionId && val.isRequired === '1',
    );

    if (selectedOptionValid) {
      setShowRequired(false);
      // Proceed to add to cart
      if (isLoggedIn) {
        dispatch(addToCart(data));
      } else {
        router.push('/sign-in');
      }
    } else {
      setShowRequired(true);
    }
  };

  useEffect(() => {
    if (isAddedToCart) {
      const timer = setTimeout(() => {
        dispatch(resetIsAddedToCart());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAddedToCart, dispatch]);
  //End add to cart list functions

  //Start add to wishlist functions
  const handleAddToWishlist = () => {
    dispatch(
      addToWishlist({
        customer_id: customer?.customer_id,
        product_id: productDetails?.id,
      }),
    )
      .unwrap()
      .then(data => {
        if (data?.data) {
          dispatch(setDetailsAddToWistlist(data));
        }
      })
      .catch(error => {
        console.error('Add to wishlist failed:', error);
      });
  };

  useEffect(() => {
    if (isAddedToWishlist) {
      const timer = setTimeout(() => {
        dispatch(resetIsAddedToWishlist());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAddedToWishlist, dispatch]);
  //End add to wishlist functions

  // Options error functions
  const ValidationComponent = ({item}) => {
    return (
      showRequired &&
      item.is_require === '1' &&
      !selectedValue.some(
        selectedItem =>
          selectedItem.optionId === item.option_id ||
          selectedItem.optionId === item.attribute_id,
      ) && (
        <p className="mb-0 w-full text-red-500">
          {lang.this_is_required_field}
        </p>
      )
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div>
      {productDetails?.type_id == 'configurable' &&
        productDetails?.extension_attributes?.configurable_product_options?.map(
          (item, idx) => {
            return (
              <div key={idx}>
                <div
                  key={item.attribute_id}
                  className="flex items-center border-b border-dashed border-gray-200 py-3">
                  <label className="w-40 shrink-0 font-bold">
                    {item.label}
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap w-full gap-4 mt-2">
                      {item?.options?.map((option, idx) => (
                        <label
                          key={idx}
                          htmlFor={`finish${option.value_index}`}
                          className="relative rounded-md whitespace-nowrap ">
                          <input
                            type="radio"
                            id={`finish${option.value_index}`}
                            name={`finish${item.attribute_id}`}
                            value={option.value_index}
                            onChange={e => {
                              addConfigurableAttribute(item, option);
                              if (
                                item.label == 'Special Effect' ||
                                item.label == 'Special Effects'
                              )
                                if (option.label == 'Foil') {
                                  setShowColor(true);
                                } else {
                                  setShowColor(false);
                                }
                            }}
                            className="peer sr-only"
                          />

                          <span
                            className="border-2 border-muted rounded-md bg-popover px-3 py-1 text-sm transition-all hover:cursor-pointer peer-checked:border-primary w-full h-full flex flex-col items-center justify-between 
                           ">
                            {option.swatch_image != null && (
                              <Image
                                className="my-auto"
                                src={option.swatch_image}
                                height={20}
                                width={20}
                                alt={''}
                              />
                            )}
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    <ValidationComponent item={item} />
                  </div>
                </div>
              </div>
            );
          },
        )}

      {productDetails?.options?.map((item, index) => (
        <div key={index}>
          {item.title === 'Printing' && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">{'Printing'}</label>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-4 mt-2">
                  {item?.values?.map((option, idx) => (
                    <label
                      key={idx}
                      htmlFor={`printing-${option.option_type_id}`}
                      className="relative whitespace-nowrap flex items-center justify-center">
                      <input
                        type="radio"
                        id={`printing-${option.option_type_id}`}
                        name="printing"
                        value={option.option_type_id}
                        onChange={e => {
                          if (option.title == 'Printed') {
                            setPrinted(true);
                          } else {
                            setPrinted(false);
                          }
                          addDataFunc(item, option);
                        }}
                        className="sr-only peer"
                      />
                      <span className="rounded-md border-2 border-muted bg-popover px-3 py-1 text-sm transition-all hover:cursor-pointer peer-checked:border-primary w-full h-full flex items-center justify-center">
                        {option.title}
                      </span>
                    </label>
                  ))}
                </div>

                <ValidationComponent item={item} />
              </div>
            </div>
          )}

          {item.title != 'Design' &&
            item.title != 'Delivery' &&
            item.title != 'Upload Artwork' &&
            item.title != 'Comments' &&
            item.title != 'Message / Comments' &&
            // item.title != 'Shape (cms)' &&
            // item.title != 'Shape (Cms)' &&
            item.title != 'Printing' &&
            item.title != 'Where to Use' &&
            item.title != 'Color' && (
              <>
                <div className="flex items-center border-b border-dashed border-gray-200 py-3">
                  <label className="w-40 shrink-0 font-bold">
                    {item.title == 'Qty' || item.title == 'Quantity'
                      ? 'Quantity'
                      : item.title}
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-4 mt-2">
                      {item?.values?.map((option, idx) => {
                        return (
                          <label
                            key={idx}
                            htmlFor={`attr-${option.option_type_id}`}
                            className="relative whitespace-nowrap flex items-center justify-center">
                            <input
                              type="radio"
                              id={`attr-${option.option_type_id}`}
                              name={`attr-${item.option_id}`}
                              value={option.option_type_id}
                              onChange={e => {
                                addDataFunc(item, option);
                                if (
                                  item.title == 'Special Effect' ||
                                  item.title == 'Special Effects'
                                )
                                  if (option.title == 'Foil') {
                                    setShowColor(true);
                                  } else {
                                    setShowColor(false);
                                  }
                              }}
                              className="peer sr-only"
                            />
                            <span className="rounded-md border-2 border-muted bg-popover px-3 py-1 text-sm transition-all hover:cursor-pointer peer-checked:border-primary w-full h-full flex items-center justify-center">
                              {option.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <ValidationComponent item={item} />
                  </div>
                </div>
              </>
            )}

          {item.title === 'Color' && showColor && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">{'Color'}</label>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-4 mt-2">
                  {item?.values?.map((option, idx) => (
                    <div key={idx}>
                      <input
                        type="radio"
                        id={`color-${option.option_type_id}`}
                        name="color"
                        value={option.option_type_id}
                        onChange={e => {
                          addDataFunc(item, option);
                        }}
                        className="peer sr-only"
                      />
                      <label
                        style={{
                          background: colorFunc(option.title),
                        }}
                        htmlFor={`color-${option.option_type_id}`}
                        className="relative whitespace-nowrap flex items-center justify-center rounded-full border-2 size-6 peer-checked:border-primary"></label>
                    </div>
                  ))}
                </div>

                <ValidationComponent item={item} />
              </div>
            </div>
          )}

          {item.title === 'Design' && printed && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">{'Design'}</label>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-4 mt-2">
                  {item.values.map((option, idx) => (
                    <label
                      key={idx}
                      htmlFor={`design-${option.option_type_id}`}
                      className="relative whitespace-nowrap flex items-center justify-center">
                      <input
                        type="radio"
                        id={`design-${option.option_type_id}`}
                        name="design"
                        value={option.option_type_id}
                        onChange={e => {
                          addDataFunc(item, option);
                          designAdditionalFunc(option);
                        }}
                        className="peer sr-only"
                      />
                      <span className="rounded-md border-2 border-muted bg-popover px-3 py-1 text-sm transition-all hover:cursor-pointer peer-checked:border-primary w-full h-full flex items-center justify-center">
                        {option.price == 0
                          ? option.title
                          : `Design Assistance (+${currentCurrency} ${
                              option.price * currencyRate
                            })`}
                      </span>
                    </label>
                  ))}
                </div>
                <ValidationComponent item={item} />
              </div>
            </div>
          )}

          {item.title === 'Upload Artwork' && uploadFile && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">
                {'Upload Artwork'}
              </label>
              <input
                type="file"
                onChange={e => {
                  addFile(item, e.target.files[0]);
                }}
                className="cursor-pointer"
              />
              <ValidationComponent item={item} />
            </div>
          )}

          {item.title === 'Delivery' && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">{'Delivery'}</label>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-4 mt-2">
                  {item?.values?.map((option, idx) => (
                    <label
                      key={idx}
                      htmlFor={`delivery-${option.option_type_id}`}
                      className="relative whitespace-nowrap flex items-center justify-center">
                      <input
                        type="radio"
                        id={`delivery-${option.option_type_id}`}
                        name="delivery"
                        value={option.option_type_id}
                        onChange={e => {
                          addDataFunc(item, option);
                        }}
                        className="peer sr-only"
                      />
                      <div className="gap-2 rounded-md border-2 border-muted bg-popover px-3 py-1 text-sm transition-all hover:cursor-pointer peer-checked:border-primary w-full h-full flex items-center justify-center">
                        <Image src={deliveryIcons[option.title]} alt={''} />
                        <span>{option.title}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <ValidationComponent item={item} />
              </div>
            </div>
          )}

          {(item.title == 'Comments' || item.title == 'Message / Comments') && (
            <div className="flex flex-col gap-3 border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">
                {lang.message_comments}
              </label>
              <textarea
                name="comments"
                onChange={e => {
                  addCommentFunc(item, e.target.value);
                }}
                className="border border-muted rounded-md max-w-96 h-28 p-3 focus:outline-none"
              />
              <ValidationComponent item={item} />
            </div>
          )}

          {item.title === 'Where to Use' && (
            <div className="flex items-center border-b border-dashed border-gray-200 py-3">
              <label className="w-40 shrink-0 font-bold">
                {'Where to use'}
              </label>
              <input
                type="text"
                onChange={e => {
                  addCommentFunc(item, e.target.value);
                }}
                className="flex-1 border border-muted rounded-md px-2 py-1 focus:outline-none"
              />
              <ValidationComponent item={item} />
            </div>
          )}
        </div>
      ))}

      {productDetails?.price && (
        <h4 className="mt-3 font-bold text-2xl">
          {lang.subtotal}{' '}
          <span className="text-primary">
            {currentCurrency}{' '}
            {typeof productDetails?.price == 'object'
              ? _.round(
                  productDetails?.price?.min_price * currencyRate * quantity +
                    designPrice,
                  2,
                ).toFixed(2)
              : _.round(
                  productDetails?.price * currencyRate * quantity + designPrice,
                  2,
                ).toFixed(2)}
          </span>
        </h4>
      )}
      {isLoggedIn ? (
        <div className="flex gap-6 mt-5">
          <Button
            className="hover:bg-primary"
            disabled={isLoadingAddToCart || isAddedToCart}
            onClick={() => addToCartFunc()}>
            {isLoadingAddToCart ? (
              <>{lang.adding}</>
            ) : isAddedToCart ? (
              <>{lang.added}</>
            ) : (
              <>
                <ShoppingCart />
                {lang.add_to_cart}
              </>
            )}
          </Button>
          {!is_in_wishlist ? (
            <Button
              className="hover:bg-primary"
              disabled={isAddedToWishlist || isLoadingAddToWishlist}
              onClick={handleAddToWishlist}>
              {isLoadingAddToWishlist
                ? `${lang.adding}`
                : isAddedToWishlist
                ? `${lang.added}`
                : `${lang.add_to_wishlist}`}
            </Button>
          ) : (
            <Button disabled={true} className="hover:bg-primary">
              {lang.added_to_wishlist}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex gap-6 mt-5">
          <Button
            onClick={() => router.push('/sign-in')}
            className="hover:bg-primary">
            {lang.add_to_cart}
          </Button>
          <Button
            onClick={() => router.push('/sign-in')}
            className="hover:bg-primary">
            {lang.add_to_wishlist}
          </Button>
        </div>
      )}
    </div>
  );
};

const SpecificationForm = ({productDetails, lang}) => {
  const productDescription = productDetails?.custom_attributes?.find(
    item => item.attribute_code === 'description',
  );

  if (productDescription?.value) {
    return (
      <div
        className="px-2 specification-form"
        dangerouslySetInnerHTML={{__html: productDescription.value}}></div>
    );
  }

  return <div>{lang.no_specification_found || 'No specification found'}</div>;
};
