import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../apis/apiThunks';

// API call to get product list by search
export const getProductsBySeach = createApiThunk(
  'product/getProductsBySearch',
  ({ search, categoryId, currentPage, perPages }) => `${process.env.PAPERCUT_API_BASE_URL}products/search/?search=${search}&categoryId=${categoryId}&page=${currentPage}&pageSize=${perPages}`,
  'GET',
);


const initialState = {
  searchProductList: [],
  page: 1,
  pageSize: 12,
  totalCount: 0,
  message: null,
  isError: false,
  isLoadingProductsBySearch: false
};

const searchProductSlice = createSlice({
  name: 'searchproduct',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
    setSearchedAddToWistlist: (state, action) => {
      const updatedProductItem = state.searchProductList.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              is_in_wishlist: action.payload.is_in_wishlist
            };
          }
          return item;
        });

        state.searchProductList = updatedProductItem;
    },
  },

  extraReducers: builder => {

    // Get products by search
    builder.addCase(getProductsBySeach.pending, state => {
      state.isLoadingProductsBySearch = true;
    });
    builder.addCase(getProductsBySeach.fulfilled, (state, action) => {
      state.isLoadingProductsBySearch = false;
      state.searchProductList = action.payload.items;
      state.page = action.payload.page;
      // state.pageSize = action.payload.page_size;
      state.totalCount = action.payload.total_count;
    });
    builder.addCase(getProductsBySeach.rejected, (state, action) => {
      state.isLoadingProductsBySearch = false;
      state.message = action.payload.message;
    });
  },
});

export const {
  clearMessage,
  setSearchedAddToWistlist
} = searchProductSlice.actions;
export default searchProductSlice.reducer;
