import {createSlice} from '@reduxjs/toolkit';
import {COUNTRY, CURRENCY} from '../apis/keywords';
import Cookies from 'js-cookie';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    return {
      currencyList: [],
      exchangeRateList: [],
      currentCurrency: Cookies.get(CURRENCY) || 'QAR',
      country: Cookies.get(COUNTRY) || 'Qatar',
      currencyRate: 1,
      countryList: [],
      isLoading: false,
      message: null,
    };
  }

  return {
    currencyList: [],
    exchangeRateList: [],
    currentCurrency: null,
    country: null,
    currencyRate: 1,
    countryList: [],
    isLoading: false,
    message: null,
  };
};

const initialState = getInitialState();

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
    },
    setCurrentLocation: (state, action) => {
      state.country = action.payload;
    },
    setCurrentCurrency: (state, action) => {
      state.currentCurrency = action.payload;
      state.currencyRate =
        state.exchangeRateList?.find(
          item => item.currency_to === action.payload,
        )?.rate ?? 1;
    },

    setCurrencies: (state, action) => {
      state.currencyList = action.payload.available_currency_codes;
      state.exchangeRateList = action.payload.exchange_rates;
      state.currencyRate =
        action.payload.exchange_rates?.find(
          item => item.currency_to === state.currentCurrency,
        )?.rate ?? 1;
      state.isLoading = false;
    },

    setCountries: (state, action) => {
      state.countryList = action.payload;
      state.isLoading = false;
    },

    setLocation: (state, action) => {
      state.country = action.payload?.country_name;
      if (typeof window !== 'undefined' && action.payload?.country_name) {
        Cookies.set(COUNTRY, action.payload.country_name);
      }
      state.isLoading = false;
    },
  },
});

export const {
  clearMessage,
  setCurrentCurrency,
  setCurrencyRate,
  setCurrentLocation,
  setCurrencies,
  setCountries,
  setLocation,
} = currencySlice.actions;
export default currencySlice.reducer;
