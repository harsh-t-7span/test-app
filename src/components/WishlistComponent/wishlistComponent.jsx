'use client';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToWishlist,
  removeFromWishList,
  setCategoryAddToWistlist,
  setFeaturedAddToWistlist,
} from '@/lib/slices/productSlice';
import {setSearchedAddToWistlist} from '@/lib/slices/searchProductSlice';
import {useRouter} from 'next-nprogress-bar';
import {Heart} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const WishlistComponent = ({type, productId, isInWishlist}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {customer, isLoggedIn} = useSelector(state => state.customerData);

  const [toggleWishlist, setToggleWishlist] = useState(isInWishlist);

  const handleRemoveFromWishlist = async () => {
    try {
      const data = await dispatch(
        removeFromWishList({
          customer_id: customer.customer_id,
          product_id: productId,
        }),
      ).unwrap();

      if (data?.status) {
        setToggleWishlist(false);
      }
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const data = await dispatch(
        addToWishlist({
          customer_id: customer.customer_id,
          product_id: productId,
        }),
      ).unwrap();

      if (data?.data) {
        setToggleWishlist(true);

        switch (type) {
          case 'FeaturedProducts':
            dispatch(setFeaturedAddToWistlist(data.data));
            break;
          case 'CategoryProducts':
            dispatch(setCategoryAddToWistlist(data.data));
            break;
          case 'SearchedProducts':
            dispatch(setSearchedAddToWistlist(data.data));
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error('Add to wishlist failed:', error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Button
          variant="ghost"
          type="button"
          className="p-0 hover:bg-background"
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={
            toggleWishlist ? handleRemoveFromWishlist : handleAddToWishlist
          }
          aria-label={
            isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
          }>
          <Heart
            className={cn(
              'w-5 h-5',
              toggleWishlist ? 'text-red-500 fill-red-500' : 'text-primary',
            )}
          />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="p-0 hover:bg-background"
          type="button"
          onClick={() => router.push('/sign-in')}
          title="Login to add to wishlist"
          aria-label="Login to add to wishlist">
          <Heart className="w-5 h-5 text-gray-500" />
        </Button>
      )}
    </>
  );
};

export default WishlistComponent;
