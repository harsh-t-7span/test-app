import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  categoryList: [],
  isError: false,
  isLoadingCategory: false,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null;
      state.isError = false;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
  },
});

export const {clearMessage, setCategoryList} = categorySlice.actions;
export default categorySlice.reducer;
