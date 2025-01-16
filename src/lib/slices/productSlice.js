import {createSlice} from '@reduxjs/toolkit';
import {createApiThunk} from '../apis/apiThunks';

// API call to get feature product
export const getFeatureProducts = createApiThunk(
  'product/getFeatureProducts',
  `${process.env.PAPERCUT_API_BASE_URL}customapi/featured`,
  'GET',
);

// API call to get all products
export const getAllProducts = createApiThunk(
  'product/getAllProducts',
  `${process.env.PAPERCUT_API_BASE_URL}all/products`,
  'GET',
);
// API call to get quote Id
export const getQuoteId = createApiThunk(
  'product/getQuoteId',
  `${process.env.PAPERCUT_API_BASE_URL}carts/mine`,
  'POST',
);
// API call to get product list by Id
export const getProductsById = createApiThunk(
  'product/getProductsById',
  categoryId =>
    `${process.env.PAPERCUT_API_BASE_URL}category/products/${categoryId}`,
  'GET',
);

// API call to get product details by Id
export const getProductDetailsById = createApiThunk(
  'product/getProductDetailsById',
  sku => `${process.env.PAPERCUT_API_BASE_URL}products/details/${sku}`,
  'GET',
);

// API call to get product images
export const getProductImages = createApiThunk(
  'product/getProductImages',
  `${process.env.PAPERCUT_API_BASE_URL}product/configurable-product/associated-details`,
  'POST',
);

// API call to get cart list
export const getCartList = createApiThunk(
  'product/cartList',
  customer_id =>
    `${process.env.PAPERCUT_API_BASE_URL}customer/cartinfo/${customer_id}`,
  'GET',
);

// API call to add to cart list
export const addToCart = createApiThunk(
  'product/addToCart',
  `${process.env.PAPERCUT_API_BASE_URL}carts/mine/items`,
  'POST',
);

// API call to remove from cart list
export const removeFromCart = createApiThunk(
  'product/removeFromCart',
  item_id => `${process.env.PAPERCUT_API_BASE_URL}carts/mine/items/${item_id}`,
  'DELETE',
);

// API call to review a product
export const addReviewProduct = createApiThunk(
  'product/addReviewProduct',
  `${process.env.PAPERCUT_API_BASE_URL}reviews`,
  'POST',
);

// API call to Like for a review
export const reviewLike = createApiThunk(
  'product/reviewLike',
  ({review_id, customer_id}) =>
    `${process.env.PAPERCUT_API_BASE_URL}review/${review_id}/${customer_id}/like`,
  'POST',
);

// API call to Like for a review
export const reviewUnlike = createApiThunk(
  'product/reviewUnlike',
  ({review_id, customer_id}) =>
    `${process.env.PAPERCUT_API_BASE_URL}review/${review_id}/${customer_id}/unlike`,
  'POST',
);

// API call to get wishlist list
export const getWishList = createApiThunk(
  'product/wishList',
  customer_id =>
    `${process.env.PAPERCUT_API_BASE_URL}wishlist/customer/items?customer_id=${customer_id}`,
  'GET',
);

// API call to add to wishlist list
export const addToWishlist = createApiThunk(
  'product/addToWishlist',
  data =>
    `${process.env.PAPERCUT_API_BASE_URL}wishlist/customer/product/${data.customer_id}/${data.product_id}`,
  'POST',
);

// API call to remove from Wishlist
export const removeFromWishList = createApiThunk(
  'product/removeFromWishList',
  data =>
    `${process.env.PAPERCUT_API_BASE_URL}wishlist/customer/item/${data.customer_id}/${data.product_id}`,
  'DELETE',
);

//API call for estimate cost
export const estimationCost = createApiThunk(
  'product/estimationCost',
  `${process.env.PAPERCUT_API_BASE_URL}carts/mine/estimate-shipping-methods`,
  'POST',
);

// API call for Complete Shipping Cost
export const completeShippingCost = createApiThunk(
  'product/completeShippingCost',
  `${process.env.PAPERCUT_API_BASE_URL}carts/mine/shipping-information`,
  'POST',
);

// API call for add coupons
export const addCoupon = createApiThunk(
  'product/addCoupon',
  `${process.env.PAPERCUT_API_BASE_URL}apply-coupon`,
  'POST',
);

// API call for remove coupons
export const removeCoupon = createApiThunk(
  'product/removeCoupon',
  `${process.env.PAPERCUT_API_BASE_URL}cancel-coupon`,
  'POST',
);

// API call to make Order
export const makeOrder = createApiThunk(
  'product/makeOrder',
  `${process.env.PAPERCUT_API_BASE_URL}carts/mine/payment-information`,
  'POST',
);

// API call for Paypal payment
export const payPalPayment = createApiThunk(
  'product/payPalPayment',
  `${process.env.PAPERCUT_API_BASE_URL}paypal/checkout`,
  'POST',
);
// API call for Paypal Token payment
export const payPalToken = createApiThunk(
  'product/payPalToken',
  `${process.env.PAPERCUT_API_BASE_URL}paypalapi/createpaypalexpresstoken`,
  'POST',
);

//API call for Paypal success
export const payPalSuccess = createApiThunk(
  'product/payPalSuccess',
  payId =>
    `${process.env.PAPERCUT_API_BASE_URL}paypal/payment/details/${payId}`,
  'GET',
);

// const loadCartData = () => {
//   try {
//     const serializedCart = localStorage.getItem('cartData');
//     return serializedCart
//       ? JSON.parse(serializedCart)
//       : {
//           cartList: [],
//           cartId: '',
//           estimatePrice: '',
//           extraCostList: [],
//         };
//   } catch (e) {
//     return {
//       cartList: [],
//       cartId: '',
//       estimatePrice: '',
//       extraCostList: [],
//     };
//   }
// };

// const saveCartData = cartData => {
//   try {
//     const serializedCart = JSON.stringify(cartData);
//     localStorage.setItem('cartData', serializedCart);
//   } catch (e) {
//     console.error('Could not save cart data', e);
//   }
// };

const initialState = {
  productList: [],
  quoteId: '',
  productDetails: {},
  is_in_wishlist: false,
  productImages: {},
  totalCount: 0,
  featuredProduct: [],
  categoryName: '',
  wishList: [],
  categoryDetails: null,
  message: null,
  isError: false,
  isLoading: false,
  isLoadingFeatureProducts: false,
  isLoadingAllProducts: false,
  isLoadingQuoteId: false,
  isLoadingProductsById: false,
  isLoadingProductDetailsById: false,
  isLoadingProductImages: false,
  isLoadingAddToCart: false,
  isAddedToCart: false,
  isLoadingRemoveFromCart: false,
  isLoadingAddReviewProduct: false,
  isLoadingWishList: false,
  isLoadingAddToWishlist: false,
  isAddedToWishlist: false,
  isLoadingRemoveFromWishList: false,
  isPaymentLoading: false,
  numberofDeleteWishlist: 0,
  shippingAddress: '',
  shippingAddressId: '',
  billingAddress: '',
  paymentMethods: [],
  paymentData: '',
  approvalUrl: '',
  shippingMethod: '',

  // Cart
  // ...loadCartData(),
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
    resetIsAddedToCart: state => {
      state.isAddedToCart = false;
    },
    resetIsAddedToWishlist: state => {
      state.isAddedToWishlist = false;
    },
    setProductList: (state, action) => {
      // state.productList = action.payload;
      // state.productList.push(...action.payload);
      state.productList = [...state.productList, ...action.payload];
      state.categoryDetails = action.payload.category;
    },
    resetProductList: state => {
      state.productList = [];
      state.categoryDetails = {};
    },
    shortByProducts: (state, action) => {
      const {sortByValue} = action.payload;
      if (sortByValue === 'price') {
        state.productList.sort((a, b) => a.price - b.price);
      } else if (sortByValue === 'productname') {
        state.productList.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
    setFeaturedAddToWistlist: (state, action) => {
      const updatedProductItem = state.featuredProduct.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            is_in_wishlist: action.payload.is_in_wishlist,
          };
        }
        return item;
      });

      state.featuredProduct = updatedProductItem;
    },
    setCategoryAddToWistlist: (state, action) => {
      const updatedProductItem = state.productList.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            is_in_wishlist: action.payload.is_in_wishlist,
          };
        }
        return item;
      });

      state.productList = updatedProductItem;
    },
    setDetailsAddToWistlist: (state, action) => {
      if (state.productDetails.id === action?.payload?.data?.id) {
        state.productDetails.is_in_wishlist =
          action?.payload?.data?.is_in_wishlist;
      }
    },
  },

  extraReducers: builder => {
    // Feature products
    builder.addCase(getFeatureProducts.pending, state => {
      state.isLoadingFeatureProducts = true;
    });
    builder.addCase(getFeatureProducts.fulfilled, (state, action) => {
      state.isLoadingFeatureProducts = false;
      state.featuredProduct = action.payload;
    });
    builder.addCase(getFeatureProducts.rejected, (state, action) => {
      state.isLoadingFeatureProducts = false;
      state.message = action.payload.message;
    });
    // All products
    builder.addCase(getAllProducts.pending, state => {
      state.isLoadingAllProducts = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isLoadingAllProducts = false;
      state.productList = action.payload;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.isLoadingAllProducts = false;
      state.message = action.payload.message;
    });

    // Quote id
    builder.addCase(getQuoteId.pending, state => {
      //state.isLoadingQuoteId = true;
    });
    builder.addCase(getQuoteId.fulfilled, (state, action) => {
      // state.isLoadingQuoteId = false;
      state.quoteId = action.payload;
    });
    builder.addCase(getQuoteId.rejected, (state, action) => {
      //state.isLoadingQuoteId = false;
      state.message = action.payload.message;
    });

    // Get products by id
    builder.addCase(getProductsById.pending, state => {
      state.isLoadingProductsById = true;
    });
    builder.addCase(getProductsById.fulfilled, (state, action) => {
      state.isLoadingProductsById = false;
      state.productList = action.payload.products;
      state.categoryDetails = action.payload.category;
    });
    builder.addCase(getProductsById.rejected, (state, action) => {
      state.isLoadingProductsById = false;
      state.message = action.payload.message;
    });

    // Get product details by id
    builder.addCase(getProductDetailsById.pending, state => {
      state.isLoadingProductDetailsById = true;
    });
    builder.addCase(getProductDetailsById.fulfilled, (state, action) => {
      state.isLoadingProductDetailsById = false;
      state.productDetails = action.payload;
      state.is_in_wishlist = action.payload?.is_in_wishlist;
    });
    builder.addCase(getProductDetailsById.rejected, (state, action) => {
      state.isLoadingProductDetailsById = false;
      state.message = action.payload.message;
    });

    // Get products images
    builder.addCase(getProductImages.pending, state => {
      state.isLoadingProductImages = true;
    });
    builder.addCase(getProductImages.fulfilled, (state, action) => {
      state.isLoadingProductImages = false;
      state.productImages = action.payload;
    });
    builder.addCase(getProductImages.rejected, (state, action) => {
      state.isLoadingProductImages = false;
      state.message = action.payload.message;
    });

    // Cart List
    builder.addCase(getCartList.pending, state => {
      state.isLoadingCartList = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.isLoadingCartList = false;
      if (action.payload.status == false) {
      } else {
        state.cartId = action.payload?.id;
        state.cartList = action.payload?.items;
        state.estimatePrice = action.payload?.estimation_shipping_and_tax;
        state.shippingAddress = action.payload?.customer?.shipping_address;
        // saveCartData({
        //   ...loadCartData(),
        //   cartList: action.payload?.items,
        //   cartId: action.payload?.id,
        //   estimatePrice: action.payload?.estimation_shipping_and_tax,
        // });
      }
    });
    builder.addCase(getCartList.rejected, (state, action) => {
      state.isLoadingCartList = false;
      state.message = action.payload.message;
    });

    // Add to Cart
    builder.addCase(addToCart.pending, state => {
      state.isLoadingAddToCart = true;
      state.message = '';
      state.isError = false;
      state.isAddedToCart = false;
    });

    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoadingAddToCart = false;

      const matchItem = state.cartList.find(
        item => item.item_id == action.payload.item_id,
      );
      if (matchItem) {
        const newArray = state.cartList.map(item => {
          if (item.item_id == action.payload.item_id) {
            return {
              ...item,
              qty: item.qty + 1,
            };
          }
          return item;
        });
        state.cartList = newArray;
      } else {
        state.cartList = [...state.cartList, action.payload];
      }

      // saveCartData({
      //   ...loadCartData(),
      //   cartList: action.payload,
      // });

      // state.cartList = [...state.cartList, action.payload];
      state.message = `You added ${action.payload.name} to your`;
      state.isError = false;
      state.isAddedToCart = true;
    });

    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoadingAddToCart = false;
      state.message = action.payload;
      state.isError = true;
      state.isAddedToCart = false;
    });

    //Remove from Cart
    builder.addCase(removeFromCart.pending, state => {
      state.isLoadingRemoveFromCart = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoadingRemoveFromCart = false;
      // state.cartList = action.payload.items;
      // state.estimatePrice = action.payload?.estimation_shipping_and_tax;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoadingRemoveFromCart = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Product Review
    builder.addCase(addReviewProduct.pending, state => {
      state.isLoadingAddReviewProduct = true;
    });
    builder.addCase(addReviewProduct.fulfilled, (state, action) => {
      state.isLoadingAddReviewProduct = false;
      state.isError = false;
    });
    builder.addCase(addReviewProduct.rejected, (state, action) => {
      state.isLoadingAddReviewProduct = false;
      // state.message = action.payload;
      // state.isError = true;
    });

    // Wish List
    builder.addCase(getWishList.pending, state => {
      state.isLoadingWishList = true;
      state.numberofDeleteWishlist = 0;
    });
    builder.addCase(getWishList.fulfilled, (state, action) => {
      state.isLoadingWishList = false;
      state.wishList = action.payload;
    });
    builder.addCase(getWishList.rejected, (state, action) => {
      state.isLoadingWishList = false;
      state.message = action.payload.message;
    });

    //Add To Wishlist
    builder.addCase(addToWishlist.pending, state => {
      state.isLoadingAddToWishlist = true;
      state.message = '';
      state.isError = false;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.isLoadingAddToWishlist = false;
      state.wishList = [...state.wishList, action.payload.data];
      state.isAddedToWishlist = true;
      state.message = `${action.payload.data.name} added to your`;
      state.isError = false;
      state.is_in_wishlist = true;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.isLoadingAddToWishlist = false;
      state.isAddedToWishlist = false;
      state.message = action.payload;
      state.isError = true;
    });

    //Remove from Wishlist
    builder.addCase(removeFromWishList.pending, state => {
      state.isLoadingRemoveFromWishList = true;
    });
    builder.addCase(removeFromWishList.fulfilled, (state, action) => {
      let tempArr = state.wishList.filter(
        item => item.id != action.meta.arg.productId,
      );
      state.isLoadingRemoveFromWishList = false;
      state.wishList = tempArr;
      state.message = `${
        state.numberofDeleteWishlist + 1
      } item(s) remove from the wishlist`;
      state.numberofDeleteWishlist = state.numberofDeleteWishlist + 1;
      state.isError = false;
      state.is_in_wishlist = false;
    });
    builder.addCase(removeFromWishList.rejected, (state, action) => {
      state.isLoadingRemoveFromWishList = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Estimate Cost
    builder.addCase(estimationCost.pending, state => {
      state.isLoadingEstimationCost = true;
    });
    builder.addCase(estimationCost.fulfilled, (state, action) => {
      state.isLoadingEstimationCost = false;
      state.extraCostList = action.payload;
      // saveCartData({
      //   ...loadCartData(),
      //   extraCostList: action.payload,
      // });
    });
    builder.addCase(estimationCost.rejected, (state, action) => {
      state.isLoadingEstimationCost = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Complete Shipping Estimation
    builder.addCase(completeShippingCost.pending, state => {
      state.isLoadingCompleteShippingCost = true;
    });
    builder.addCase(completeShippingCost.fulfilled, (state, action) => {
      state.isLoadingCompleteShippingCost = false;
      // state.wishList = tempArr;
      state.estimatePrice = {
        ...action.payload.totals,
        sub_total: action.payload.totals?.subtotal,
        grand_total: action.payload.totals?.grand_total,
        discountAmount: action.payload.totals?.discount_amount,
        shipping_amount: action.payload.totals?.shipping_amount,
        shipping_carrier: {
          shipping_price: action.payload.totals?.shipping_amount,
        },
      };
      state.paymentMethods = action.payload.payment_methods;
      state.billingAddress = action.meta.arg.addressInformation.billing_address;
      state.shippingMethod = {
        shipping_carrier_code:
          action.meta.arg.addressInformation.shipping_carrier_code,
        shipping_method_code:
          action.meta.arg.addressInformation.shipping_method_code,
      };
      state.shippingAddress =
        action.meta.arg.addressInformation.shipping_address;
    });
    builder.addCase(completeShippingCost.rejected, (state, action) => {
      state.isLoadingCompleteShippingCost = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Add Coupons
    builder.addCase(addCoupon.pending, state => {
      state.isLoadingEstimationCost = true;
    });
    builder.addCase(addCoupon.fulfilled, (state, action) => {
      state.isLoadingEstimationCost = false;
      if (action.payload.status == false) {
        state.isError = true;
        state.message = action.payload.message;
      } else {
        // state.estimatePrice = {...action.payload,sub_total:action.payload.sub_total.replace(/,/g, '')};
        state.estimatePrice = action.payload;
        state.isError = false;
        state.message = '';
      }
    });
    builder.addCase(addCoupon.rejected, (state, action) => {
      state.isLoadingEstimationCost = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Remove coupons
    builder.addCase(removeCoupon.pending, state => {
      state.isLoadingEstimationCost = true;
    });
    builder.addCase(removeCoupon.fulfilled, (state, action) => {
      state.isLoadingEstimationCost = false;
      state.estimatePrice = action.payload;
    });
    builder.addCase(removeCoupon.rejected, (state, action) => {
      state.isLoadingEstimationCost = false;
      state.message = action.payload.message;
      state.isError = true;
    });

    //Review Like
    builder.addCase(reviewLike.pending, state => {
      state.message = null;
    });
    builder.addCase(reviewLike.fulfilled, (state, action) => {
      const updatedReviewItem =
        state.productDetails.product_reviews.reviews.map(item => {
          if (item.review_id === action.payload.data.review_id) {
            return {
              ...item,
              like_customer_ids: [
                ...item.like_customer_ids,
                action.payload.customer_id,
              ],
              ...action.payload.data,
            };
          }
          return item;
        });
      state.productDetails.product_reviews.reviews = updatedReviewItem;
      state.message = action.payload.msg;
    });
    builder.addCase(reviewLike.rejected, (state, action) => {
      state.message = action.payload.msg;
    });
    //Review unlike
    builder.addCase(reviewUnlike.pending, state => {
      state.message = null;
    });
    builder.addCase(reviewUnlike.fulfilled, (state, action) => {
      const updatedReviewItem =
        state.productDetails.product_reviews.reviews.map(item => {
          if (item.review_id === action.payload.data.review_id) {
            return {
              ...item,
              ...action.payload.data,
            };
          }
          return item;
        });
      state.productDetails.product_reviews.reviews = updatedReviewItem;
      state.message = action.payload.msg;
    });
    builder.addCase(reviewUnlike.rejected, (state, action) => {
      state.message = action.payload.msg;
    });

    //Make Order
    builder.addCase(makeOrder.pending, state => {
      state.isPaymentLoading = true;
    });
    builder.addCase(makeOrder.fulfilled, (state, action) => {
      state.isPaymentLoading = false;
      if (action.payload.status == false) {
        state.message = action.payload.msg;
      } else {
        state.cartList = [];
      }
    });
    builder.addCase(makeOrder.rejected, (state, action) => {
      state.isPaymentLoading = false;
      state.message = action.payload.message;
    });
    builder
      .addCase(payPalPayment.pending, state => {
        state.isPaymentLoading = true;
      })
      .addCase(payPalPayment.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        if (action.payload.status == false) {
          state.message = action.payload.msg;
          state.isError = true;
        } else {
          state.approvalUrl = action.payload;
        }
      })
      .addCase(payPalPayment.rejected, (state, action) => {
        state.isPaymentLoading = false;
      });

    builder
      .addCase(payPalToken.pending, state => {
        state.isPaymentLoading = true;
      })
      .addCase(payPalToken.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        if (action.payload.status == false) {
          state.message = action.payload.msg;
          state.isError = true;
        } else {
          state.approvalUrl = action.payload;
        }
      })
      .addCase(payPalToken.rejected, (state, action) => {
        state.isPaymentLoading = false;
      });
    builder
      .addCase(payPalSuccess.pending, state => {
        state.isPaymentLoading = true;
      })
      .addCase(payPalSuccess.fulfilled, (state, action) => {
        state.isPaymentLoading = false;
        if (action.payload.status == false) {
        } else {
          state.paymentData = action.payload.data;
        }
      })
      .addCase(payPalSuccess.rejected, (state, action) => {
        state.isPaymentLoading = false;
      });
  },
});

export const {
  clearMessage,
  resetIsAddedToCart,
  resetIsAddedToWishlist,
  shortByProducts,
  setFeaturedAddToWistlist,
  setCategoryAddToWistlist,
  setDetailsAddToWistlist,
  setProductList,
  resetProductList,
} = productSlice.actions;
export default productSlice.reducer;
