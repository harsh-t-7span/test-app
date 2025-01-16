import {createSlice} from '@reduxjs/toolkit';
import {createApiThunk} from '../apis/apiThunks';

// API calls
export const getAboutus = createApiThunk(
  'cms/getAboutus',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/about-papercut`,
  'GET',
);

export const getMission = createApiThunk(
  'cms/getMission',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/our-mission`,
  'GET',
);

export const getVision = createApiThunk(
  'cms/getVision',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/our-vision`,
  'GET',
);

export const getAdditionalLink = createApiThunk(
  'cms/getAdditionalLink',
  `${process.env.PAPERCUT_API_BASE_URL}topmenu`,
  'GET',
);

export const sendContact = createApiThunk(
  'cms/sendContact',
  `${process.env.PAPERCUT_API_BASE_URL}contactus`,
  'POST',
);

export const getFAQs = createApiThunk(
  'cms/getfaqs',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/faqs`,
  'GET',
);

export const getPrivacyPolicy = createApiThunk(
  'cms/getPrivacyPolicy',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/privacy-policy`,
  'GET',
);

export const getTermsConditions = createApiThunk(
  'cms/getTermsConditions',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/terms-and-conditions`,
  'GET',
);

export const getRefundPolicy = createApiThunk(
  'cms/getRefundPolicy',
  `${process.env.PAPERCUT_API_BASE_URL}cms-page/refund-policy`,
  'GET',
);

const initialState = {
  about: {},
  mission: {},
  vision: {},
  faqs: {},
  profileLink: null,
  recycleLink: null,
  message: null,
  isError: false,
  isLoading: false,
  privacyPolicy: '',
  termsConditions: '',
  refundPolicy: '',
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
    cmsFailed(state, action) {
      state.message = action.payload.message;
      state.isError = true;
    },
    sendMessage(state, action) {
      state.message = action.payload.message;
      state.isError = false;
    },
  },

  extraReducers: builder => {
    // Handle aboutus fetch
    builder
      .addCase(getAboutus.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAboutus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.about = action.payload.content;
      })
      .addCase(getAboutus.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    // Handle mission fetch
    builder
      .addCase(getMission.pending, state => {
        state.isLoading = true;
      })
      .addCase(getMission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mission = action.payload.content;
      })
      .addCase(getMission.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    // Handle vision fetch
    builder
      .addCase(getVision.pending, state => {
        state.isLoading = true;
      })
      .addCase(getVision.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vision = action.payload.content;
      })
      .addCase(getVision.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    // Handle contact send
    builder
      .addCase(sendContact.pending, state => {
        state.isLoading = true;
      })
      .addCase(sendContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.msg;
        state.isError = false;
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.msg;
        state.isError = true;
      });

    // Handle additional link fetch
    builder
      .addCase(getAdditionalLink.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAdditionalLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileLink = action.payload.profile_link;
        state.recycleLink = action.payload.recycle_link;
      })
      .addCase(getAdditionalLink.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    //Handle FAQ's List
    builder
      .addCase(getFAQs.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFAQs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs = action.payload.content;
      })
      .addCase(getFAQs.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    //Handle Privacy Policy
    builder
      .addCase(getPrivacyPolicy.pending, state => {
        state.isLoading = true;
      })
      .addCase(getPrivacyPolicy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.privacyPolicy = action.payload.content;
      })
      .addCase(getPrivacyPolicy.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    //Handle Terms and Conditions
    builder
      .addCase(getTermsConditions.pending, state => {
        state.isLoading = true;
      })
      .addCase(getTermsConditions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.termsConditions = action.payload.content;
      })
      .addCase(getTermsConditions.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });

    //Handle Refund policy
    builder
      .addCase(getRefundPolicy.pending, state => {
        state.isLoading = true;
      })
      .addCase(getRefundPolicy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refundPolicy = action.payload.content;
      })
      .addCase(getRefundPolicy.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.isError = true;
      });
  },
});

export const {clearMessage, cmsFailed, sendMessage} = cmsSlice.actions;

export default cmsSlice.reducer;
