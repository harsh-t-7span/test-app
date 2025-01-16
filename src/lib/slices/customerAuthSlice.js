import {CURRENCY, PROFILE, TOKEN} from '@/lib/apis/keywords';
import {createSlice} from '@reduxjs/toolkit';
import {createApiThunk} from '../apis/apiThunks';
import Cookies from 'js-cookie';

// API call to login
export const customerLogin = createApiThunk(
  'customer/login',
  `${process.env.PAPERCUT_API_BASE_URL}${'login'}`,
  'POST',
);

// API call to signup
export const customerRegister = createApiThunk(
  'customer/register',
  `${process.env.PAPERCUT_API_BASE_URL}${'customers'}`,
  'POST',
);

// API call to forgot password
export const customerForgotPassword = createApiThunk(
  'customer/forgotPassword',
  `${process.env.PAPERCUT_API_BASE_URL}${'forgetpassword'}`,
  'POST',
);

// API call to change password
export const customerChangePassword = createApiThunk(
  'customer/changePassword',
  `${process.env.PAPERCUT_API_BASE_URL}${'customers/change-password'}`,
  'POST',
);

// API call to customer profile photo update
export const customerProfilePhotoUpdate = createApiThunk(
  'customer/profilePhotoUpdate',
  `${process.env.PAPERCUT_API_BASE_URL}${'customers/profile-photo'}`,
  'POST',
);

// API call to customer profile update
export const customerProfileUpdate = createApiThunk(
  'customer/profileUpdate',
  `${process.env.PAPERCUT_API_BASE_URL}${'customapi/customer/update'}`,
  'POST',
);

// API call to customer profile
export const getCustomerProfile = createApiThunk(
  'customer/getCustomerProfile',
  customerId =>
    `${process.env.PAPERCUT_API_BASE_URL}customer/info/${customerId}`,
  'GET',
);

// API call to Shipping Address List
export const getShippingAddressList = createApiThunk(
  'customer/getShippingAddressList',
  customerId =>
    `${process.env.PAPERCUT_API_BASE_URL}shipping-address-list/${customerId}`,
  'GET',
);

// API call to add Shipping Address
export const addShippingAddress = createApiThunk(
  'customer/addShippingAddress',
  `${process.env.PAPERCUT_API_BASE_URL}address/save`,
  'POST',
);

// API call to edit Shipping Address
export const editShippingAddress = createApiThunk(
  'customer/editShippingAddress',
  ({addressId}) =>
    `${process.env.PAPERCUT_API_BASE_URL}customapi/address/${addressId}`,
  'POST',
  ({newAddress}) => newAddress,
);

// API call to delete Shipping Address
export const removeAddress = createApiThunk(
  'product/removeAddress',
  addressId =>
    `${process.env.PAPERCUT_API_BASE_URL}customer/addresses/${addressId}`,
  'DELETE',
);

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const customer = Cookies.get(PROFILE)
      ? JSON.parse(Cookies.get(PROFILE))
      : undefined;
    const deviceToken = Cookies.get(TOKEN);
    const currency = Cookies.get(CURRENCY) || 'QAR';

    return {
      isLoggedIn: customer ? true : false,
      customer: customer || null,
      deviceToken: deviceToken || null,
      message: null,
      isError: false,
      isLoading: false,
      currency: currency,
      shippingAddressList: [],
      addressLoading: false,
    };
  }

  return {
    isLoggedIn: false,
    customer: null,
    deviceToken: null,
    message: null,
    isError: false,
    isLoading: false,
    currency: 'QAR',
    shippingAddressList: [],
    addressLoading: false,
  };
};

const initialState = getInitialState();

const customerAuthSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.customer = null;
      state.deviceToken = null;
      localStorage.removeItem('cartData');
      Cookies.remove(PROFILE);
      Cookies.remove(TOKEN);
      Cookies.remove(CURRENCY);
      // Cookies.remove(SHIPMETHOD);
    },
  },
  extraReducers: builder => {
    //Login
    builder.addCase(customerLogin.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.customer = action.payload.customer;
        state.deviceToken = action.payload.token;
      } else {
        state.isLoading = false;
        state.isError = true;
      }
    });
    builder.addCase(customerLogin.pending, state => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(customerLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    //Register
    builder.addCase(customerRegister.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });
    builder.addCase(customerRegister.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(customerRegister.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    // Change Password
    builder.addCase(customerChangePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });
    builder.addCase(customerChangePassword.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(customerChangePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    // Forgot Password
    builder.addCase(customerForgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = 'Password reset email sent. Please check your inbox.';
    });
    builder.addCase(customerForgotPassword.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(customerForgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = 'Unable to process your request. Please try again later.';
    });

    // Profile Update
    builder.addCase(customerProfileUpdate.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.status == false) {
        state.message = action.payload.msg;
        state.isError = true;
      } else {
        state.customer = action.payload.customer;
        state.message = 'You saved the account information.';
      }
    });
    builder.addCase(customerProfileUpdate.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(customerProfileUpdate.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    // get customer profile
    builder.addCase(getCustomerProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.customer = action.payload.customer;
      state.message = action.payload.message;
    });
    builder.addCase(getCustomerProfile.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(getCustomerProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    // get customer profile
    builder.addCase(customerProfilePhotoUpdate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.customer.profile_photo = action.payload.profile_photo;
      state.message = 'You saved the profile photo.';
    });
    builder.addCase(customerProfilePhotoUpdate.pending, state => {
      state.isLoading = true;
      state.isError = false;
      state.message = null;
    });
    builder.addCase(customerProfilePhotoUpdate.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.msg;
    });

    // Get Shipping Address List
    builder.addCase(getShippingAddressList.pending, state => {
      state.addressLoading = true;
    });
    builder.addCase(getShippingAddressList.fulfilled, (state, action) => {
      state.addressLoading = false;
      state.shippingAddressList = action.payload;
    });
    builder.addCase(getShippingAddressList.rejected, (state, action) => {
      state.addressLoading = false;
      state.isError = true;
      state.message = action.payload.msg;
    });

    // Add Shipping Address
    builder.addCase(addShippingAddress.pending, state => {
      state.addressLoading = true;
    });
    builder.addCase(addShippingAddress.fulfilled, (state, action) => {
      state.addressLoading = false;
      state.shippingAddressList = [
        ...state.shippingAddressList,
        action.payload.data.address,
      ];
    });
    builder.addCase(addShippingAddress.rejected, (state, action) => {
      state.addressLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    // Edit Shipping Address
    builder.addCase(editShippingAddress.pending, state => {
      state.addressLoading = true;
    });
    builder.addCase(editShippingAddress.fulfilled, (state, action) => {
      if (action.payload.status == false) {
        state.isError = true;
        state.message = action.payload.msg;
      } else {
        state.addressLoading = false;
        // const updatedShippingAddressList = state.shippingAddressList.map(
        //   address => {
        //     if (address.id === action.meta.arg.addressId) {
        //       return {
        //         ...address,
        //         ...action.payload.data.address,
        //       };
        //     }
        //     return address;
        //   },
        // );
        state.shippingAddressList = action.payload.data;
      }
    });
    builder.addCase(editShippingAddress.rejected, (state, action) => {
      state.addressLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    // Delete Shipping Address
    builder.addCase(removeAddress.pending, state => {
      state.addressLoading = true;
    });
    builder.addCase(removeAddress.fulfilled, (state, action) => {
      state.addressLoading = false;
      state.shippingAddressList = state.shippingAddressList.filter(
        item => item.id != action.meta.arg,
      );
    });
    builder.addCase(removeAddress.rejected, (state, action) => {
      state.addressLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const {logout, clearMessage} = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
