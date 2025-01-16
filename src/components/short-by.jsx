'use client';
import React from 'react';
import {useDispatch} from 'react-redux';
import {shortByProducts} from '@/lib/slices/productSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ShortByComponent = ({lang}) => {
  const dispatch = useDispatch();

  const handleShortByChange = e => {
    dispatch(
      shortByProducts({
        sortByValue: e,
      }),
    );
  };

  return (
    <>
      <Select onValueChange={handleShortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`${lang.sort_by}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value={'productname'}>{`${lang.product_name}`}</SelectItem>
          <SelectItem value={'price'}>{`${lang.price}`}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default ShortByComponent;
