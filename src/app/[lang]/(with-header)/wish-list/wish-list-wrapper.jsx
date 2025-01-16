'use client';

import React, {useEffect, useCallback, useMemo} from 'react';
import Image from 'next/image';
import {useRouter} from 'next-nprogress-bar';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  getWishList,
  removeFromWishList,
  clearMessage,
} from '@/lib/slices/productSlice';
import {WishlistPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import PreFooter from '@/components/PreFooter/preFooter';
import cartNotFoundImg from '../../../../../public/images/shopping-cart.png';
import {Button} from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {X} from 'lucide-react';
import {createSlug} from '../../../../lib/utils';

const WishlistCard = ({
  item,
  lan,
  onAddToBag,
  onRemoveFromWishlist,
  currentCurrency,
  currencyRate,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Image
            src={item.thumbnail_url}
            alt={item.name}
            width={100}
            height={100}
            className="rounded-md object-cover"
            loading="lazy"
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {lan.unit_price || 'Unit Price'}: {currentCurrency}{' '}
              {(Number(item.price) * currencyRate).toFixed(2)}
            </p>
            <span
              className={
                item.product_stock ? 'text-green-600' : 'text-red-600'
              }>
              {item.product_stock ? lan.in_stock : lan.out_of_stock}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRemoveFromWishlist(item.id)}
          aria-label="Remove from wishlist">
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Button
          variant="secondary"
          onClick={() => onAddToBag(item)}
          className="flex-grow mr-2  max-w-xs">
          {lan.add_to_bag || 'Add To Bag'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const WishlistTable = ({
  data,
  lan,
  onAddToBag,
  onRemoveFromWishlist,
  currentCurrency,
  currencyRate,
}) => {
  return (
    <div>
      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map(item => (
          <WishlistCard
            key={item.id}
            item={item}
            lan={lan}
            onAddToBag={onAddToBag}
            onRemoveFromWishlist={onRemoveFromWishlist}
            currentCurrency={currentCurrency}
            currencyRate={currencyRate}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-foreground text-base">
                {lan.product_name || 'Product Name'}
              </TableHead>
              <TableHead className="font-bold text-foreground text-base">
                {lan.unit_price || 'Unit Price'}
              </TableHead>
              <TableHead className="font-bold text-foreground text-base">
                {lan.stock_status || 'Stock Status'}
              </TableHead>
              <TableHead className="font-bold text-foreground text-base">
                {lan.add_to_bag || 'Add To Bag'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="rounded-md"
                      loading="lazy"
                    />
                    <div>{item.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {currentCurrency}{' '}
                  {(Number(item.price) * currencyRate).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      item.product_stock ? 'text-green-600' : 'text-red-600'
                    }>
                    {item.product_stock ? lan.in_stock : lan.out_of_stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => onAddToBag(item)}>
                      {lan.add_to_bag || 'Add To Bag'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-full size-8"
                      size="icon"
                      onClick={() => onRemoveFromWishlist(item.id)}
                      aria-label="Remove from wishlist">
                      <X className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const WishlistWrapper = ({lan}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.customerData);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${lan.lang}/`);
    }
  }, [isLoggedIn]);

  const {customer} = useSelector(state => state.customerData, shallowEqual);

  const {wishList, isLoadingWishList} = useSelector(
    state => state.productData,
    shallowEqual,
  );

  const {currentCurrency, currencyRate} = useSelector(
    state => state.currencyData,
    shallowEqual,
  );

  // Fetch wishlist and clear message on mount
  useEffect(() => {
    if (customer?.customer_id) {
      dispatch(getWishList(customer.customer_id));
    }
    dispatch(clearMessage());
  }, [dispatch, customer?.customer_id]);

  const handleAddToBag = item => {
    const productSlug = createSlug(item?.name);

    const categoryId = item.category_links.category_id;
    const categorySlug = item.category_links.url_key;

    router.push(
      `/${lan.lang}/${categorySlug}/${categoryId}/${productSlug}/${item.sku}`,
    );
  };

  const handleRemoveFromWishlist = useCallback(
    productId => {
      if (customer?.customer_id) {
        dispatch(
          removeFromWishList({
            customer_id: customer.customer_id,
            product_id: productId,
          }),
        )
          .unwrap()
          .then(data => {
            if (data) {
              dispatch(getWishList(customer.customer_id));
            }
          });
      }
    },
    [dispatch, customer?.customer_id],
  );

  const wishlistContent = useMemo(() => {
    if (isLoadingWishList) {
      return <WishlistPlaceholder />;
    }

    if (wishList.length > 0) {
      return (
        <WishlistTable
          data={wishList}
          lan={lan}
          currentCurrency={currentCurrency}
          currencyRate={currencyRate}
          onAddToBag={handleAddToBag}
          onRemoveFromWishlist={handleRemoveFromWishlist}
        />
      );
    }

    return (
      <div className="text-center py-12">
        <Image
          src={cartNotFoundImg}
          alt="Wishlist is empty"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">
          {lan.your_wishlist_is_empty || 'Your Wishlist is Empty'}
        </h2>
        <p className="text-muted-foreground">
          {
            lan.your_wishlist_is_currently_empty_browse_our_products_and_add_items_to_your_wishlist
          }
        </p>
      </div>
    );
  }, [
    isLoadingWishList,
    wishList,
    lan,
    handleAddToBag,
    handleRemoveFromWishlist,
    currentCurrency,
    currencyRate,
  ]);

  return (
    <>
      <section className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">
            {lan.wishlist || 'Wishlist'}
          </h2>
          {wishlistContent}
        </div>
      </section>
      <PreFooter lang={lan} />
    </>
  );
};

export default WishlistWrapper;
