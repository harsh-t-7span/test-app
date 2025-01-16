import {createSlice} from '@reduxjs/toolkit';
import {createApiThunk} from '../apis/apiThunks';

// API call to get Order list
export const orderList = createApiThunk(
  'order/orderList',
  customer_id =>
    `${process.env.PAPERCUT_API_BASE_URL}orders/history/${customer_id}`,
  'GET',
);

// API call to get Order details
export const orderDetails = createApiThunk(
  'order/orderDetails',
  order_id => `${process.env.PAPERCUT_API_BASE_URL}orders/${order_id}`,
  'GET',
);

//API call for Tracking
export const trackingDetailsApi = createApiThunk(
  'order/trackingDetailsApi',
  ({orderID, trackingId}) =>
    `${process.env.PAPERCUT_API_BASE_URL}fedex/track/?orderId=${orderID}&&trackingNumber=${trackingId}`,
  'GET',
);

//API call for Refund Request
export const refundRequest = createApiThunk(
  'product/refundRequest',
  `${process.env.PAPERCUT_API_BASE_URL}refund-request`,
  'POST',
);

const initialState = {
  orderDataList: [],
  orderData: {},
  trackingData: '',
  message: null,
  isError: false,
  isLoading: false,
  isOrderLoading: false,
  isRefundRequest: false,
  isCancelProduct: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
  },

  extraReducers: builder => {
    // Order List
    builder.addCase(orderList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(orderList.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status == false) {
      } else {
        state.orderDataList = action.payload;
      }
    });
    builder.addCase(orderList.rejected, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });

    // Order Details
    builder.addCase(orderDetails.pending, state => {
      state.isOrderLoading = true;
    });
    builder.addCase(orderDetails.fulfilled, (state, action) => {
      state.isOrderLoading = false;
      if (action.payload.status == false) {
      } else {
        state.orderData = action.payload;
      }
    });
    builder.addCase(orderDetails.rejected, (state, action) => {
      state.isOrderLoading = false;
      state.message = action.payload.message;
    });

    //Tracking Data
    builder.addCase(trackingDetailsApi.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(trackingDetailsApi.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status == false) {
      } else {
        state.trackingData = action.payload;
      }
    });
    builder.addCase(trackingDetailsApi.rejected, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });

    //Refund Request
    builder.addCase(refundRequest.pending, state => {
      state.isRefundRequest = true;
    });
    builder.addCase(refundRequest.fulfilled, (state, action) => {
      state.isRefundRequest = false;
      if (action.payload.status == false) {
      } else {
        state.message = action.payload?.msg;
        state.isError = false;
      }
    });
    builder.addCase(refundRequest.rejected, (state, action) => {
      state.isRefundRequest = false;
      state.message = action.payload.message;
    });
  },
});

export const {clearMessage} = orderSlice.actions;
export default orderSlice.reducer;
