'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import WishlistComponent from '@/components/WishlistComponent/wishlistComponent';
import Image from 'next/image';
import _ from 'lodash';
import ReactStars from 'react-stars';

const ProductCard = ({
  item,
  currencyRate,
  currentCurrency,
  type,
  children,
  lang,
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <WishlistComponent
            type={type}
            productId={item.id}
            isInWishlist={item.is_in_wishlist}
          />
          <div className="text-right">
            <div className="text-primary text-sm lg:text-base font-bold">
              {currentCurrency}{' '}
              {_.round(item.price * currencyRate, 2).toFixed(2)}
            </div>
            <div className="text-xs lg:text-sm text-muted-foreground">
              {lang.per_unit || 'Per Unit'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col  justify-center items-center p-0">
        <Image
          width={500}
          height={500}
          src={item.thumbnail_url || ''}
          alt={item.name || 'a'}
          className="object-contain w-full max-h-48 "
        />
        <p className="font-semibold text-base lg:text-lg text-center p-4">
          {item.name}
        </p>
        <ReactStars
          count={5}
          size={30}
          value={item?.rating?.average_rating}
          color2="#FFD700"
          color1="#e7e7e7"
          edit={false}
        />
      </CardContent>
      <CardFooter className="mt-4 justify-center">{children}</CardFooter>
    </Card>
  );
};

export default ProductCard;
